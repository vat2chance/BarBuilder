import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation';
import { createOrder, addOrderItem, closeOrder, getOrders, getOrderById } from '../services/posService';
import { createPayment } from '../services/paymentService';
import { createKDSTicket, updateKDSTicketStatus } from '../services/kdsService';
import { deductInventory } from '../services/inventoryService';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createOrderSchema = z.object({
  locationId: z.string().cuid(),
  tableId: z.string().cuid().optional(),
  customerId: z.string().cuid().optional(),
  orderType: z.enum(['DINE_IN', 'TAKEOUT', 'DELIVERY']).default('DINE_IN'),
  notes: z.string().optional(),
  kitchenNotes: z.string().optional(),
  allergyNotes: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL')
});

const addOrderItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  notes: z.string().optional(),
  customizations: z.record(z.any()).optional()
});

const closeOrderSchema = z.object({
  taxRate: z.number().min(0).max(1).default(0.0875),
  tip: z.number().min(0).default(0),
  payment: z.object({
    method: z.enum(['CASH', 'CARD', 'CONTACTLESS', 'MOBILE', 'SPLIT']),
    amount: z.number().positive(),
    transactionId: z.string().optional(),
    stripePaymentIntentId: z.string().optional(),
    metadata: z.record(z.any()).optional()
  })
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['OPEN', 'PREPARING', 'READY', 'SERVED', 'CLOSED', 'CANCELLED'])
});

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

/**
 * @route POST /api/pos/orders
 * @desc Create a new order
 * @access Private
 */
router.post('/orders', validateRequest(createOrderSchema), async (req, res, next) => {
  try {
    const { locationId, tableId, customerId, orderType, notes, kitchenNotes, allergyNotes, priority } = req.body;
    const userId = req.user.id;
    const organizationId = req.headers['x-organization-id'] as string;

    const order = await createOrder({
      organizationId,
      locationId,
      tableId,
      customerId,
      orderType,
      notes,
      kitchenNotes,
      allergyNotes,
      priority,
      openedBy: userId
    });

    // Create KDS ticket for kitchen orders
    if (orderType !== 'TAKEOUT') {
      await createKDSTicket(order.id);
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/pos/orders
 * @desc Get all orders for the organization
 * @access Private
 */
router.get('/orders', async (req, res, next) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string;
    const { 
      locationId, 
      status, 
      orderType, 
      date, 
      page = 1, 
      limit = 50 
    } = req.query;

    const orders = await getOrders({
      organizationId,
      locationId: locationId as string,
      status: status as string,
      orderType: orderType as string,
      date: date as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: orders.length
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/pos/orders/:id
 * @desc Get order by ID
 * @access Private
 */
router.get('/orders/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const organizationId = req.headers['x-organization-id'] as string;

    const order = await getOrderById(id, organizationId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/pos/orders/:id/items
 * @desc Add item to order
 * @access Private
 */
router.post('/orders/:id/items', validateRequest(addOrderItemSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { menuItemId, quantity, unitPrice, notes, customizations } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    const orderItem = await addOrderItem({
      orderId: id,
      menuItemId,
      quantity,
      unitPrice,
      notes,
      customizations,
      organizationId
    });

    res.status(201).json({
      success: true,
      data: orderItem,
      message: 'Item added to order successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/pos/orders/:id/status
 * @desc Update order status
 * @access Private
 */
router.patch('/orders/:id/status', validateRequest(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    const order = await prisma.order.update({
      where: {
        id,
        organizationId
      },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        customer: true,
        payments: true
      }
    });

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/pos/orders/:id/close
 * @desc Close order and process payment
 * @access Private
 */
router.post('/orders/:id/close', validateRequest(closeOrderSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taxRate, tip, payment } = req.body;
    const userId = req.user.id;
    const organizationId = req.headers['x-organization-id'] as string;

    // Close the order
    const order = await closeOrder({
      orderId: id,
      organizationId,
      taxRate,
      tip,
      closedBy: userId
    });

    // Process payment
    const paymentRecord = await createPayment({
      orderId: id,
      userId,
      method: payment.method,
      amount: payment.amount,
      transactionId: payment.transactionId,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      metadata: payment.metadata
    });

    // Deduct inventory for all items
    for (const item of order.items) {
      await deductInventory({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        organizationId
      });
    }

    res.json({
      success: true,
      data: {
        order,
        payment: paymentRecord
      },
      message: 'Order closed and payment processed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// KDS (KITCHEN DISPLAY SYSTEM)
// ============================================================================

/**
 * @route GET /api/pos/kds/tickets
 * @desc Get all KDS tickets for a location
 * @access Private
 */
router.get('/kds/tickets', async (req, res, next) => {
  try {
    const { locationId } = req.query;
    const organizationId = req.headers['x-organization-id'] as string;

    const tickets = await prisma.kDSTicket.findMany({
      where: {
        order: {
          locationId: locationId as string,
          organizationId
        },
        status: {
          in: ['NEW', 'PREPARING', 'READY']
        }
      },
      include: {
        order: {
          include: {
            items: {
              include: {
                menuItem: true
              }
            },
            table: true,
            customer: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PATCH /api/pos/kds/tickets/:id/status
 * @desc Update KDS ticket status
 * @access Private
 */
router.patch('/kds/tickets/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    const ticket = await updateKDSTicketStatus({
      ticketId: id,
      status,
      organizationId
    });

    res.json({
      success: true,
      data: ticket,
      message: 'KDS ticket status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// PAYMENTS
// ============================================================================

/**
 * @route GET /api/pos/payments
 * @desc Get all payments for the organization
 * @access Private
 */
router.get('/payments', async (req, res, next) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string;
    const { 
      orderId, 
      method, 
      status, 
      date, 
      page = 1, 
      limit = 50 
    } = req.query;

    const where: any = {
      order: {
        organizationId
      }
    };

    if (orderId) where.orderId = orderId as string;
    if (method) where.method = method as string;
    if (status) where.status = status as string;
    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.createdAt = {
        gte: startDate,
        lt: endDate
      };
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            table: true,
            customer: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string)
    });

    const total = await prisma.payment.count({ where });

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/pos/payments/:id/refund
 * @desc Process refund for payment
 * @access Private
 */
router.post('/payments/:id/refund', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        order: {
          organizationId
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status to refunded
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'REFUNDED',
        metadata: {
          ...payment.metadata,
          refund: {
            amount,
            reason,
            processedAt: new Date().toISOString()
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// TABLES
// ============================================================================

/**
 * @route GET /api/pos/tables
 * @desc Get all tables for a location
 * @access Private
 */
router.get('/tables', async (req, res, next) => {
  try {
    const { locationId } = req.query;
    const organizationId = req.headers['x-organization-id'] as string;

    const tables = await prisma.table.findMany({
      where: {
        locationId: locationId as string,
        location: {
          organizationId
        }
      },
      include: {
        orders: {
          where: {
            status: {
              in: ['OPEN', 'PREPARING', 'READY']
            }
          },
          include: {
            items: {
              include: {
                menuItem: true
              }
            }
          }
        }
      },
      orderBy: {
        number: 'asc'
      }
    });

    res.json({
      success: true,
      data: tables
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/pos/tables
 * @desc Create a new table
 * @access Private
 */
router.post('/tables', async (req, res, next) => {
  try {
    const { locationId, number, capacity } = req.body;
    const organizationId = req.headers['x-organization-id'] as string;

    // Verify location belongs to organization
    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        organizationId
      }
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const table = await prisma.table.create({
      data: {
        locationId,
        number,
        capacity: capacity || 4
      },
      include: {
        orders: true
      }
    });

    res.status(201).json({
      success: true,
      data: table,
      message: 'Table created successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;