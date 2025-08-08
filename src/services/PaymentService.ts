import { PaymentCard, PaymentResponse } from '../types';

interface Receipt {
  receiptNumber: string;
  businessName: string;
  businessAddress: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: string;
  transactionId?: string;
  timestamp: string;
  employeeName: string;
}

class PaymentService {
  private static instance: PaymentService;
  private receiptCounter: number = 10001;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Process different payment methods
  public async processCardPayment(amount: number, card: PaymentCard): Promise<PaymentResponse> {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate card details
      if (!this.validateCard(card)) {
        return {
          success: false,
          paymentMethod: 'card',
          timestamp: new Date().toISOString(),
          processingTime: 2000,
          errorMessage: 'Invalid card details'
        };
      }

      // Simulate successful payment
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Card payment processed: $${amount.toFixed(2)}`);
      
      return {
        success: true,
        paymentMethod: 'card',
        timestamp: new Date().toISOString(),
        processingTime: 2000,
        transactionId
      };
    } catch (error) {
      console.error('❌ Card payment failed:', error);
      return {
        success: false,
        paymentMethod: 'card',
        timestamp: new Date().toISOString(),
        processingTime: 2000,
        errorMessage: 'Payment processing failed'
      };
    }
  }

  public async processContactlessPayment(amount: number): Promise<PaymentResponse> {
    try {
      // Simulate contactless payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Contactless payment processed: $${amount.toFixed(2)}`);
      
      return {
        success: true,
        paymentMethod: 'contactless',
        timestamp: new Date().toISOString(),
        processingTime: 1500,
        transactionId
      };
    } catch (error) {
      console.error('❌ Contactless payment failed:', error);
      return {
        success: false,
        paymentMethod: 'contactless',
        timestamp: new Date().toISOString(),
        processingTime: 1500,
        errorMessage: 'Contactless payment failed'
      };
    }
  }

  public async processMobilePayment(amount: number, method: 'apple_pay' | 'google_pay' | 'samsung_pay'): Promise<PaymentResponse> {
    try {
      // Simulate mobile payment processing
      await new Promise(resolve => setTimeout(resolve, 1800));

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ ${method} payment processed: $${amount.toFixed(2)}`);
      
      return {
        success: true,
        paymentMethod: method,
        timestamp: new Date().toISOString(),
        processingTime: 1800,
        transactionId
      };
    } catch (error) {
      console.error(`❌ ${method} payment failed:`, error);
      return {
        success: false,
        paymentMethod: method,
        timestamp: new Date().toISOString(),
        processingTime: 1800,
        errorMessage: `${method} payment failed`
      };
    }
  }

  public processCashPayment(amount: number, cashTendered: number): { success: boolean; changeDue: number; errorMessage?: string } {
    if (cashTendered < amount) {
      return {
        success: false,
        changeDue: 0,
        errorMessage: 'Insufficient cash tendered'
      };
    }

    const changeDue = cashTendered - amount;
    console.log(`✅ Cash payment processed: $${amount.toFixed(2)}, Change: $${changeDue.toFixed(2)}`);
    
    return {
      success: true,
      changeDue
    };
  }

  // Generate receipt
  public generateReceipt(order: any, paymentResponse: PaymentResponse, employeeName: string): Receipt {
    const receipt: Receipt = {
      receiptNumber: `R${this.receiptCounter++}`,
      businessName: 'Barback Pro Demo',
      businessAddress: '123 Main Street, City, State 12345',
      orderNumber: order.orderNumber.toString(),
      items: order.items.map((item: any) => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        total: item.subtotal
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      tip: order.tip,
      total: order.total,
      paymentMethod: paymentResponse.paymentMethod.toUpperCase(),
      transactionId: paymentResponse.transactionId,
      timestamp: new Date().toISOString(),
      employeeName
    };

    console.log(`🧾 Receipt generated: #${receipt.receiptNumber}`);
    return receipt;
  }

  // Print receipt (simulated)
  public printReceipt(receipt: Receipt): void {
    const receiptText = `
╔══════════════════════════════════════╗
║           ${receipt.businessName.padEnd(34)} ║
║         ${receipt.businessAddress.padEnd(34)} ║
╠══════════════════════════════════════╣
║ Receipt: ${receipt.receiptNumber.padEnd(28)} ║
║ Order: #${receipt.orderNumber.padEnd(29)} ║
║ Date: ${new Date(receipt.timestamp).toLocaleDateString().padEnd(30)} ║
║ Time: ${new Date(receipt.timestamp).toLocaleTimeString().padEnd(30)} ║
║ Server: ${receipt.employeeName.padEnd(27)} ║
╠══════════════════════════════════════╣
║ ITEMS:                               ║
${receipt.items.map(item => {
  const itemLine = `║ ${item.quantity}x ${item.name}`;
  const padding = 38 - itemLine.length;
  return itemLine + ' '.repeat(Math.max(0, padding)) + '║';
}).join('\n')}
╠══════════════════════════════════════╣
║ Subtotal: ${' '.repeat(20)}$${receipt.subtotal.toFixed(2).padStart(8)} ║
║ Tax: ${' '.repeat(25)}$${receipt.tax.toFixed(2).padStart(8)} ║
${receipt.tip > 0 ? `║ Tip: ${' '.repeat(25)}$${receipt.tip.toFixed(2).padStart(8)} ║` : ''}
║ TOTAL: ${' '.repeat(22)}$${receipt.total.toFixed(2).padStart(8)} ║
╠══════════════════════════════════════╣
║ Payment: ${receipt.paymentMethod.padEnd(26)} ║
${receipt.transactionId ? `║ Transaction: ${receipt.transactionId.padEnd(21)} ║` : ''}
║ ${' '.repeat(38)} ║
║ Thank you for your visit! 🍻         ║
║ Please come again!                   ║
╚══════════════════════════════════════╝
    `;

    console.log('🖨️ Receipt printed:');
    console.log(receiptText);
  }

  // Validate card details
  private validateCard(card: PaymentCard): boolean {
    // Basic validation
    if (!card.number || card.number.length < 13 || card.number.length > 19) {
      return false;
    }

    if (!card.cvv || card.cvv.length < 3 || card.cvv.length > 4) {
      return false;
    }

    if (!card.holderName || card.holderName.trim().length === 0) {
      return false;
    }

    const currentYear = new Date().getFullYear();
    if (card.expiryYear < currentYear || card.expiryYear > currentYear + 10) {
      return false;
    }

    if (card.expiryMonth < 1 || card.expiryMonth > 12) {
      return false;
    }

    return true;
  }

  // Process split payment
  public async processSplitPayment(amount: number, splitDetails: Array<{ method: string; amount: number }>): Promise<PaymentResponse> {
    try {
      let totalProcessed = 0;
      const transactions: string[] = [];

      for (const split of splitDetails) {
        if (split.method === 'card') {
          // Simulate card payment for split
          await new Promise(resolve => setTimeout(resolve, 1000));
          totalProcessed += split.amount;
          transactions.push(`TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        } else if (split.method === 'cash') {
          totalProcessed += split.amount;
        }
      }

      if (totalProcessed >= amount) {
        console.log(`✅ Split payment processed: $${amount.toFixed(2)}`);
        return {
          success: true,
          paymentMethod: 'split',
          timestamp: new Date().toISOString(),
          processingTime: 1000,
          transactionId: transactions.join(',')
        };
      } else {
        return {
          success: false,
          paymentMethod: 'split',
          timestamp: new Date().toISOString(),
          processingTime: 1000,
          errorMessage: 'Split payment total insufficient'
        };
      }
    } catch (error) {
      console.error('❌ Split payment failed:', error);
      return {
        success: false,
        paymentMethod: 'split',
        timestamp: new Date().toISOString(),
        processingTime: 1000,
        errorMessage: 'Split payment processing failed'
      };
    }
  }

  // Refund processing
  public async processRefund(transactionId: string, amount: number, reason: string): Promise<PaymentResponse> {
    try {
      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log(`✅ Refund processed: $${amount.toFixed(2)} for ${reason}`);
      
      return {
        success: true,
        paymentMethod: 'refund',
        timestamp: new Date().toISOString(),
        processingTime: 3000,
        transactionId: `REF_${transactionId}`
      };
    } catch (error) {
      console.error('❌ Refund failed:', error);
      return {
        success: false,
        paymentMethod: 'refund',
        timestamp: new Date().toISOString(),
        processingTime: 3000,
        errorMessage: 'Refund processing failed'
      };
    }
  }
}

export default PaymentService;
export type { Receipt };