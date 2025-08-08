interface ClientAccount {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessCode: string;
  subscriptionPlan: 'free_trial' | 'monthly' | 'yearly';
  subscriptionStatus: 'active' | 'expired' | 'suspended';
  lastLogin: string;
  employees: number;
  monthlyRevenue: number;
  createdDate: string;
  trialEndsDate?: string;
}

interface BankingInfo {
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankName: string;
  totalRevenue: number;
  monthlyFees: number;
  processingFees: number;
}

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'password_reset' | 'account_update' | 'security_alert';
  clientId?: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface AppUpdate {
  version: string;
  releaseDate: string;
  features: string[];
  bugFixes: string[];
  rolloutPercentage: number;
}

interface BackupInfo {
  lastBackup: string;
  backupSize: string;
  status: 'completed' | 'in_progress' | 'failed';
  location: 'aws_s3' | 'google_cloud' | 'azure';
}

class MasterAdminService {
  private static instance: MasterAdminService;
  
  // Mock data - in real app this would come from your backend
  private clients: ClientAccount[] = [
    {
      id: 'client_001',
      businessName: 'The Rusty Anchor',
      ownerName: 'Mike Johnson',
      email: 'mike@rustyanchor.com',
      phone: '(555) 123-4567',
      businessCode: 'RUSTY2024',
      subscriptionPlan: 'yearly',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-15T09:30:00Z',
      employees: 12,
      monthlyRevenue: 45000,
      createdDate: '2023-06-15',
    },
    {
      id: 'client_002',
      businessName: 'Downtown Sports Bar',
      ownerName: 'Sarah Wilson',
      email: 'sarah@downtownsports.com',
      phone: '(555) 234-5678',
      businessCode: 'SPORTS2024',
      subscriptionPlan: 'monthly',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-14T18:45:00Z',
      employees: 8,
      monthlyRevenue: 32000,
      createdDate: '2023-09-22',
    },
    {
      id: 'client_003',
      businessName: 'Craft Beer Corner',
      ownerName: 'David Chen',
      email: 'david@craftcorner.com',
      phone: '(555) 345-6789',
      businessCode: 'CRAFT2024',
      subscriptionPlan: 'free_trial',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-13T12:15:00Z',
      employees: 5,
      monthlyRevenue: 18000,
      createdDate: '2024-01-01',
      trialEndsDate: '2024-01-15',
    },
    {
      id: 'client_004',
      businessName: 'Rooftop Lounge',
      ownerName: 'Lisa Rodriguez',
      email: 'lisa@rooftopbar.com',
      phone: '(555) 456-7890',
      businessCode: 'ROOF2024',
      subscriptionPlan: 'yearly',
      subscriptionStatus: 'active',
      lastLogin: '2024-01-15T20:30:00Z',
      employees: 15,
      monthlyRevenue: 68000,
      createdDate: '2023-03-10',
    },
  ];

  private bankingInfo: BankingInfo = {
    accountNumber: '****1234',
    routingNumber: '021000021',
    accountType: 'checking',
    bankName: 'First National Bank',
    totalRevenue: 1842750,
    monthlyFees: 2470,
    processingFees: 18427,
  };

  private securityEvents: SecurityEvent[] = [
    {
      id: 'sec_001',
      type: 'login_attempt',
      clientId: 'client_001',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: '2024-01-15T08:45:00Z',
      severity: 'medium',
      resolved: true,
    },
    {
      id: 'sec_002',
      type: 'password_reset',
      clientId: 'client_002',
      description: 'Password reset requested for sarah@downtownsports.com',
      timestamp: '2024-01-14T16:20:00Z',
      severity: 'low',
      resolved: true,
    },
    {
      id: 'sec_003',
      type: 'security_alert',
      description: 'Unusual API activity detected from client_003',
      timestamp: '2024-01-13T14:30:00Z',
      severity: 'high',
      resolved: false,
    },
  ];

  private appUpdate: AppUpdate = {
    version: '2.1.5',
    releaseDate: '2024-01-20',
    features: [
      'Enhanced inventory tracking',
      'Advanced analytics dashboard',
      'Mobile payment integration',
      'Staff performance metrics',
    ],
    bugFixes: [
      'Fixed payment processing timeout',
      'Resolved inventory sync issues',
      'Improved app startup time',
    ],
    rolloutPercentage: 75,
  };

  private backupInfo: BackupInfo = {
    lastBackup: '2024-01-15T03:00:00Z',
    backupSize: '2.3 TB',
    status: 'completed',
    location: 'aws_s3',
  };

  public static getInstance(): MasterAdminService {
    if (!MasterAdminService.instance) {
      MasterAdminService.instance = new MasterAdminService();
    }
    return MasterAdminService.instance;
  }

  // Client Management
  public getAllClients(): ClientAccount[] {
    return this.clients;
  }

  public getClientById(id: string): ClientAccount | undefined {
    return this.clients.find(client => client.id === id);
  }

  public updateClientAccount(id: string, updates: Partial<ClientAccount>): boolean {
    const clientIndex = this.clients.findIndex(client => client.id === id);
    if (clientIndex !== -1) {
      this.clients[clientIndex] = { ...this.clients[clientIndex], ...updates };
      this.addSecurityEvent({
        type: 'account_update',
        clientId: id,
        description: `Account updated for ${this.clients[clientIndex].businessName}`,
        severity: 'low',
      });
      return true;
    }
    return false;
  }

  public resetClientPassword(clientId: string): string {
    const client = this.getClientById(clientId);
    if (client) {
      const newPassword = this.generateTempPassword();
      this.addSecurityEvent({
        type: 'password_reset',
        clientId: clientId,
        description: `Password reset initiated for ${client.email}`,
        severity: 'medium',
      });
      return newPassword;
    }
    throw new Error('Client not found');
  }

  public suspendClient(clientId: string): boolean {
    return this.updateClientAccount(clientId, { subscriptionStatus: 'suspended' });
  }

  public reactivateClient(clientId: string): boolean {
    return this.updateClientAccount(clientId, { subscriptionStatus: 'active' });
  }

  // Banking & Finance
  public getBankingInfo(): BankingInfo {
    return this.bankingInfo;
  }

  public updateBankingInfo(updates: Partial<BankingInfo>): boolean {
    this.bankingInfo = { ...this.bankingInfo, ...updates };
    this.addSecurityEvent({
      type: 'account_update',
      description: 'Banking information updated',
      severity: 'high',
    });
    return true;
  }

  public getRevenueStats() {
    const totalClients = this.clients.length;
    const activeClients = this.clients.filter(c => c.subscriptionStatus === 'active').length;
    const monthlyRecurring = this.clients
      .filter(c => c.subscriptionPlan === 'monthly' && c.subscriptionStatus === 'active')
      .length * 99;
    const yearlyRecurring = this.clients
      .filter(c => c.subscriptionPlan === 'yearly' && c.subscriptionStatus === 'active')
      .length * 999;
    
    return {
      totalClients,
      activeClients,
      monthlyRevenue: monthlyRecurring + (yearlyRecurring / 12),
      annualRevenue: monthlyRecurring * 12 + yearlyRecurring,
      averageRevenuePerClient: (monthlyRecurring + yearlyRecurring) / activeClients || 0,
    };
  }

  // Security Management
  public getSecurityEvents(): SecurityEvent[] {
    return this.securityEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const newEvent: SecurityEvent = {
      ...event,
      id: `sec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    this.securityEvents.unshift(newEvent);
  }

  public resolveSecurityEvent(eventId: string): boolean {
    const eventIndex = this.securityEvents.findIndex(event => event.id === eventId);
    if (eventIndex !== -1) {
      this.securityEvents[eventIndex].resolved = true;
      return true;
    }
    return false;
  }

  // App Management
  public getAppUpdate(): AppUpdate {
    return this.appUpdate;
  }

  public deployUpdate(updates: Partial<AppUpdate>): boolean {
    this.appUpdate = { ...this.appUpdate, ...updates };
    this.addSecurityEvent({
      type: 'account_update',
      description: `App updated to version ${this.appUpdate.version}`,
      severity: 'low',
    });
    return true;
  }

  // Backup Management
  public getBackupInfo(): BackupInfo {
    return this.backupInfo;
  }

  public initiateBackup(): boolean {
    this.backupInfo = {
      ...this.backupInfo,
      status: 'in_progress',
    };
    
    // Simulate backup completion after delay
    setTimeout(() => {
      this.backupInfo = {
        ...this.backupInfo,
        lastBackup: new Date().toISOString(),
        status: 'completed',
      };
    }, 3000);

    return true;
  }

  // Business Code Management
  public generateBusinessCode(businessName: string): string {
    const prefix = businessName
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 5);
    const suffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${prefix}${suffix}`;
  }

  public validateBusinessCode(code: string): boolean {
    return this.clients.some(client => client.businessCode === code);
  }

  // Analytics
  public getSystemAnalytics() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      totalClients: this.clients.length,
      activeSubscriptions: this.clients.filter(c => c.subscriptionStatus === 'active').length,
      newClientsLast30Days: this.clients.filter(c => 
        new Date(c.createdDate) > last30Days
      ).length,
      totalEmployees: this.clients.reduce((sum, client) => sum + client.employees, 0),
      totalRevenue: this.clients.reduce((sum, client) => sum + client.monthlyRevenue, 0),
      securityIncidents: this.securityEvents.filter(e => !e.resolved).length,
      systemUptime: '99.9%',
      averageResponseTime: '145ms',
    };
  }

  // Utility methods
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Theme Management
  public updateGlobalTheme(themeName: string): boolean {
    // This would update the default theme for all new users
    this.addSecurityEvent({
      type: 'account_update',
      description: `Global theme updated to ${themeName}`,
      severity: 'low',
    });
    return true;
  }
}

export default MasterAdminService;