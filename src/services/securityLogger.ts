import AsyncStorage from '@react-native-async-storage/async-storage';

// Security event types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REFRESH_FAILURE = 'TOKEN_REFRESH_FAILURE',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
}

// Security event interface
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: number;
  userId?: string;
  userType?: 'customer' | 'restaurant';
  ipAddress?: string;
  userAgent?: string;
  deviceId?: string;
  location?: string;
  details?: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Security logger configuration
const SECURITY_LOGGER_CONFIG = {
  MAX_EVENTS: 1000, // Maximum events to store locally
  RETENTION_DAYS: 90, // How long to keep events locally
  BATCH_SIZE: 50, // Number of events to send in batch
  SYNC_INTERVAL: 5 * 60 * 1000, // Sync every 5 minutes
};

class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  // Initialize the security logger
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing events from storage
      const storedEvents = await AsyncStorage.getItem('security_events');
      if (storedEvents) {
        this.events = JSON.parse(storedEvents);
        // Clean up old events
        this.cleanupOldEvents();
      }

      this.isInitialized = true;
    } catch (_error) {
      console.error('Failed to initialize security logger:', _error);
    }
  }

  // Log a security event
  public async logEvent(
    type: SecurityEventType,
    severity: SecurityEvent['severity'],
    details?: any,
    userId?: string,
    userType?: 'customer' | 'restaurant',
  ): Promise<void> {
    try {
      const event: SecurityEvent = {
        id: this.generateEventId(),
        type,
        timestamp: Date.now(),
        userId,
        userType,
        details,
        severity,
        deviceId: await this.getDeviceId(),
      };

      // Add to local events
      this.events.push(event);

      // Maintain maximum events limit
      if (this.events.length > SECURITY_LOGGER_CONFIG.MAX_EVENTS) {
        this.events = this.events.slice(-SECURITY_LOGGER_CONFIG.MAX_EVENTS);
      }

      // Save to storage
      await this.saveEvents();

      // Log to console in development
      if (__DEV__) {
      }

      // Check if we should sync with server
      if (this.shouldSyncWithServer()) {
        this.syncWithServer();
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Log successful login
  public async logLoginSuccess(
    userId: string,
    userType: 'customer' | 'restaurant',
    details?: any,
  ): Promise<void> {
    await this.logEvent(
      SecurityEventType.LOGIN_SUCCESS,
      'LOW',
      details,
      userId,
      userType,
    );
  }

  // Log failed login attempt
  public async logLoginFailure(
    email: string,
    reason: string,
    userType?: 'customer' | 'restaurant',
  ): Promise<void> {
    await this.logEvent(
      SecurityEventType.LOGIN_FAILURE,
      'MEDIUM',
      { email, reason },
      undefined,
      userType,
    );
  }

  // Log logout
  public async logLogout(
    userId: string,
    userType: 'customer' | 'restaurant',
    reason?: string,
  ): Promise<void> {
    await this.logEvent(
      SecurityEventType.LOGOUT,
      'LOW',
      { reason },
      userId,
      userType,
    );
  }

  // Log token refresh
  public async logTokenRefresh(
    userId: string,
    userType: 'customer' | 'restaurant',
    success: boolean,
    details?: any,
  ): Promise<void> {
    const eventType = success
      ? SecurityEventType.TOKEN_REFRESH
      : SecurityEventType.TOKEN_REFRESH_FAILURE;

    const severity = success ? 'LOW' : 'HIGH';

    await this.logEvent(eventType, severity, details, userId, userType);
  }

  // Log unauthorized access attempt
  public async logUnauthorizedAccess(
    userId: string,
    userType: 'customer' | 'restaurant',
    resource: string,
    details?: any,
  ): Promise<void> {
    await this.logEvent(
      SecurityEventType.UNAUTHORIZED_ACCESS,
      'HIGH',
      { resource, ...details },
      userId,
      userType,
    );
  }

  // Log suspicious activity
  public async logSuspiciousActivity(
    userId: string,
    userType: 'customer' | 'restaurant',
    activity: string,
    details?: any,
  ): Promise<void> {
    await this.logEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'CRITICAL',
      { activity, ...details },
      userId,
      userType,
    );
  }

  // Get events for a specific user
  public async getUserEvents(
    userId: string,
    limit: number = 100,
  ): Promise<SecurityEvent[]> {
    return this.events
      .filter((event) => event.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get events by type
  public async getEventsByType(
    type: SecurityEventType,
    limit: number = 100,
  ): Promise<SecurityEvent[]> {
    return this.events
      .filter((event) => event.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get events by severity
  public async getEventsBySeverity(
    severity: SecurityEvent['severity'],
    limit: number = 100,
  ): Promise<SecurityEvent[]> {
    return this.events
      .filter((event) => event.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Get recent events
  public async getRecentEvents(
    hours: number = 24,
    limit: number = 100,
  ): Promise<SecurityEvent[]> {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;

    return this.events
      .filter((event) => event.timestamp >= cutoffTime)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Clear all events
  public async clearEvents(): Promise<void> {
    this.events = [];
    await AsyncStorage.removeItem('security_events');
  }

  // Export events for analysis
  public async exportEvents(): Promise<SecurityEvent[]> {
    return [...this.events];
  }

  // Private methods
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem('device_id');
      if (!deviceId) {
        deviceId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('device_id', deviceId);
      }
      return deviceId;
    } catch {
      return 'unknown';
    }
  }

  private async saveEvents(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        'security_events',
        JSON.stringify(this.events),
      );
    } catch (error) {
      console.error('Failed to save security events:', error);
    }
  }

  private cleanupOldEvents(): void {
    const cutoffTime =
      Date.now() - SECURITY_LOGGER_CONFIG.RETENTION_DAYS * 24 * 60 * 60 * 1000;
    this.events = this.events.filter((event) => event.timestamp >= cutoffTime);
  }

  private shouldSyncWithServer(): boolean {
    // For now, always return false to keep it simple
    // In production, you might want to sync based on network availability or time intervals
    return false;
  }

  private async syncWithServer(): Promise<void> {
    // Implementation for syncing events with server
    // This would typically involve sending events to a security monitoring service
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();

// Types are already exported above
