interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'manager' | 'bartender' | 'server' | 'kitchen' | 'host' | 'busser';
  department: string;
  hireDate: string;
  hourlyRate: number;
  isActive: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  certifications: string[];
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
}

interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  breakTime?: number; // in minutes
}

interface Schedule {
  id: string;
  weekStart: string;
  weekEnd: string;
  shifts: Shift[];
  published: boolean;
  notes?: string;
}

interface PerformanceMetric {
  id: string;
  employeeId: string;
  date: string;
  metric: 'sales' | 'orders' | 'customer_satisfaction' | 'attendance' | 'efficiency';
  value: number;
  target: number;
  notes?: string;
}

class StaffService {
  private static instance: StaffService;
  private employees: Employee[] = [];
  private shifts: Shift[] = [];
  private schedules: Schedule[] = [];
  private performanceMetrics: PerformanceMetric[] = [];

  public static getInstance(): StaffService {
    if (!StaffService.instance) {
      StaffService.instance = new StaffService();
    }
    return StaffService.instance;
  }

  constructor() {
    this.initializeEmployees();
    this.initializeShifts();
    this.initializeSchedules();
  }

  private initializeEmployees() {
    this.employees = [
      {
        id: 'emp_001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@barbackpro.com',
        phone: '(555) 123-4567',
        role: 'manager',
        department: 'Management',
        hireDate: '2023-01-15',
        hourlyRate: 25.00,
        isActive: true,
        emergencyContact: {
          name: 'Mike Johnson',
          phone: '(555) 123-4568',
          relationship: 'Spouse'
        },
        certifications: ['ServSafe', 'TIPS', 'Management Training'],
        availability: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '10:00', end: '18:00', available: true },
          sunday: { start: '10:00', end: '18:00', available: false }
        }
      },
      {
        id: 'emp_002',
        firstName: 'Mike',
        lastName: 'Chen',
        email: 'mike.chen@barbackpro.com',
        phone: '(555) 234-5678',
        role: 'bartender',
        department: 'Bar',
        hireDate: '2023-03-20',
        hourlyRate: 18.00,
        isActive: true,
        emergencyContact: {
          name: 'Lisa Chen',
          phone: '(555) 234-5679',
          relationship: 'Sister'
        },
        certifications: ['TIPS', 'Mixology Certification'],
        availability: {
          monday: { start: '16:00', end: '02:00', available: true },
          tuesday: { start: '16:00', end: '02:00', available: true },
          wednesday: { start: '16:00', end: '02:00', available: true },
          thursday: { start: '16:00', end: '02:00', available: true },
          friday: { start: '16:00', end: '02:00', available: true },
          saturday: { start: '16:00', end: '02:00', available: true },
          sunday: { start: '16:00', end: '02:00', available: false }
        }
      },
      {
        id: 'emp_003',
        firstName: 'Alex',
        lastName: 'Rodriguez',
        email: 'alex.rodriguez@barbackpro.com',
        phone: '(555) 345-6789',
        role: 'server',
        department: 'Front of House',
        hireDate: '2023-02-10',
        hourlyRate: 15.00,
        isActive: true,
        emergencyContact: {
          name: 'Maria Rodriguez',
          phone: '(555) 345-6790',
          relationship: 'Mother'
        },
        certifications: ['ServSafe'],
        availability: {
          monday: { start: '11:00', end: '22:00', available: true },
          tuesday: { start: '11:00', end: '22:00', available: true },
          wednesday: { start: '11:00', end: '22:00', available: true },
          thursday: { start: '11:00', end: '22:00', available: true },
          friday: { start: '11:00', end: '23:00', available: true },
          saturday: { start: '11:00', end: '23:00', available: true },
          sunday: { start: '11:00', end: '22:00', available: true }
        }
      },
      {
        id: 'emp_004',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@barbackpro.com',
        phone: '(555) 456-7890',
        role: 'kitchen',
        department: 'Kitchen',
        hireDate: '2023-04-05',
        hourlyRate: 16.00,
        isActive: true,
        emergencyContact: {
          name: 'David Wilson',
          phone: '(555) 456-7891',
          relationship: 'Father'
        },
        certifications: ['ServSafe', 'Food Handler'],
        availability: {
          monday: { start: '10:00', end: '20:00', available: true },
          tuesday: { start: '10:00', end: '20:00', available: true },
          wednesday: { start: '10:00', end: '20:00', available: true },
          thursday: { start: '10:00', end: '20:00', available: true },
          friday: { start: '10:00', end: '21:00', available: true },
          saturday: { start: '10:00', end: '21:00', available: true },
          sunday: { start: '10:00', end: '20:00', available: false }
        }
      }
    ];
  }

  private initializeShifts() {
    this.shifts = [
      {
        id: 'shift_001',
        employeeId: 'emp_001',
        date: '2024-01-15',
        startTime: '09:00',
        endTime: '17:00',
        role: 'manager',
        status: 'completed',
        actualStartTime: '09:05',
        actualEndTime: '17:15',
        breakTime: 30
      },
      {
        id: 'shift_002',
        employeeId: 'emp_002',
        date: '2024-01-15',
        startTime: '16:00',
        endTime: '02:00',
        role: 'bartender',
        status: 'completed',
        actualStartTime: '16:00',
        actualEndTime: '02:15',
        breakTime: 45
      }
    ];
  }

  private initializeSchedules() {
    this.schedules = [
      {
        id: 'schedule_001',
        weekStart: '2024-01-15',
        weekEnd: '2024-01-21',
        shifts: this.shifts.filter(shift => 
          new Date(shift.date) >= new Date('2024-01-15') && 
          new Date(shift.date) <= new Date('2024-01-21')
        ),
        published: true,
        notes: 'Regular weekly schedule'
      }
    ];
  }

  // Employee Management
  public getEmployees(): Employee[] {
    return [...this.employees];
  }

  public getActiveEmployees(): Employee[] {
    return this.employees.filter(emp => emp.isActive);
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find(emp => emp.id === id);
  }

  public addEmployee(employee: Omit<Employee, 'id'>): boolean {
    try {
      const newEmployee: Employee = {
        ...employee,
        id: `emp_${Date.now()}`
      };

      this.employees.push(newEmployee);
      console.log(`✅ Added employee: ${newEmployee.firstName} ${newEmployee.lastName}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add employee:', error);
      return false;
    }
  }

  public updateEmployee(id: string, updates: Partial<Employee>): boolean {
    try {
      const employeeIndex = this.employees.findIndex(emp => emp.id === id);
      if (employeeIndex === -1) return false;

      this.employees[employeeIndex] = { ...this.employees[employeeIndex], ...updates };
      console.log(`✅ Updated employee: ${this.employees[employeeIndex].firstName} ${this.employees[employeeIndex].lastName}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update employee:', error);
      return false;
    }
  }

  public deactivateEmployee(id: string): boolean {
    return this.updateEmployee(id, { isActive: false });
  }

  public reactivateEmployee(id: string): boolean {
    return this.updateEmployee(id, { isActive: true });
  }

  // Shift Management
  public getShifts(): Shift[] {
    return [...this.shifts];
  }

  public getShiftsByDate(date: string): Shift[] {
    return this.shifts.filter(shift => shift.date === date);
  }

  public getShiftsByEmployee(employeeId: string): Shift[] {
    return this.shifts.filter(shift => shift.employeeId === employeeId);
  }

  public addShift(shift: Omit<Shift, 'id'>): boolean {
    try {
      const newShift: Shift = {
        ...shift,
        id: `shift_${Date.now()}`
      };

      this.shifts.push(newShift);
      console.log(`✅ Added shift for employee ${newShift.employeeId} on ${newShift.date}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add shift:', error);
      return false;
    }
  }

  public updateShift(id: string, updates: Partial<Shift>): boolean {
    try {
      const shiftIndex = this.shifts.findIndex(shift => shift.id === id);
      if (shiftIndex === -1) return false;

      this.shifts[shiftIndex] = { ...this.shifts[shiftIndex], ...updates };
      console.log(`✅ Updated shift: ${this.shifts[shiftIndex].id}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update shift:', error);
      return false;
    }
  }

  public cancelShift(id: string): boolean {
    return this.updateShift(id, { status: 'cancelled' });
  }

  public startShift(id: string): boolean {
    return this.updateShift(id, { 
      status: 'in_progress', 
      actualStartTime: new Date().toISOString() 
    });
  }

  public endShift(id: string): boolean {
    return this.updateShift(id, { 
      status: 'completed', 
      actualEndTime: new Date().toISOString() 
    });
  }

  // Schedule Management
  public getSchedules(): Schedule[] {
    return [...this.schedules];
  }

  public getCurrentSchedule(): Schedule | undefined {
    const today = new Date();
    return this.schedules.find(schedule => 
      new Date(schedule.weekStart) <= today && 
      new Date(schedule.weekEnd) >= today
    );
  }

  public createSchedule(weekStart: string, weekEnd: string, shifts: Omit<Shift, 'id'>[]): boolean {
    try {
      const newSchedule: Schedule = {
        id: `schedule_${Date.now()}`,
        weekStart,
        weekEnd,
        shifts: shifts.map(shift => ({ ...shift, id: `shift_${Date.now()}_${Math.random()}` })),
        published: false
      };

      this.schedules.push(newSchedule);
      console.log(`✅ Created schedule for week of ${weekStart}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to create schedule:', error);
      return false;
    }
  }

  public publishSchedule(scheduleId: string): boolean {
    try {
      const schedule = this.schedules.find(s => s.id === scheduleId);
      if (!schedule) return false;

      schedule.published = true;
      console.log(`✅ Published schedule: ${scheduleId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to publish schedule:', error);
      return false;
    }
  }

  // Performance Management
  public addPerformanceMetric(metric: Omit<PerformanceMetric, 'id'>): boolean {
    try {
      const newMetric: PerformanceMetric = {
        ...metric,
        id: `metric_${Date.now()}`
      };

      this.performanceMetrics.push(newMetric);
      console.log(`✅ Added performance metric for employee ${newMetric.employeeId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add performance metric:', error);
      return false;
    }
  }

  public getEmployeePerformance(employeeId: string): PerformanceMetric[] {
    return this.performanceMetrics.filter(metric => metric.employeeId === employeeId);
  }

  // Analytics
  public getStaffAnalytics() {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.getActiveEmployees().length;
    const totalShifts = this.shifts.length;
    const completedShifts = this.shifts.filter(shift => shift.status === 'completed').length;

    return {
      totalEmployees,
      activeEmployees,
      totalShifts,
      completedShifts,
      completionRate: totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 0,
      averageHourlyRate: this.employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / totalEmployees
    };
  }

  // Search employees
  public searchEmployees(query: string): Employee[] {
    const lowercaseQuery = query.toLowerCase();
    return this.employees.filter(emp => 
      emp.firstName.toLowerCase().includes(lowercaseQuery) ||
      emp.lastName.toLowerCase().includes(lowercaseQuery) ||
      emp.email.toLowerCase().includes(lowercaseQuery) ||
      emp.role.toLowerCase().includes(lowercaseQuery) ||
      emp.department.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get employees by role
  public getEmployeesByRole(role: string): Employee[] {
    return this.employees.filter(emp => emp.role === role);
  }

  // Get employees by department
  public getEmployeesByDepartment(department: string): Employee[] {
    return this.employees.filter(emp => emp.department === department);
  }

  // Get available employees for a shift
  public getAvailableEmployees(date: string, startTime: string, endTime: string): Employee[] {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    return this.employees.filter(emp => 
      emp.isActive && 
      emp.availability[dayOfWeek as keyof typeof emp.availability].available &&
      emp.availability[dayOfWeek as keyof typeof emp.availability].start <= startTime &&
      emp.availability[dayOfWeek as keyof typeof emp.availability].end >= endTime
    );
  }
}

export default StaffService;
export type { Employee, Shift, Schedule, PerformanceMetric };