// Structured Logging System
// Based on Node.js best practices and security requirements

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

export enum LogCategory {
  SECURITY = 'security',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  API = 'api',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  PERFORMANCE = 'performance',
  BUSINESS = 'business',
  SYSTEM = 'system'
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  additionalData?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.getLogLevel();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    switch (envLevel) {
      case 'error': return LogLevel.ERROR;
      case 'warn': return LogLevel.WARN;
      case 'info': return LogLevel.INFO;
      case 'debug': return LogLevel.DEBUG;
      case 'trace': return LogLevel.TRACE;
      default: return this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      context: this.sanitizeContext(context),
      metadata
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        ...(this.isDevelopment && { stack: error.stack })
      };
    }

    return entry;
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    // Remove sensitive data in production
    const sanitized = { ...context };
    
    if (!this.isDevelopment) {
      // In production, hash or truncate sensitive data
      if (sanitized.ip) {
        sanitized.ip = this.hashSensitiveData(sanitized.ip);
      }
      if (sanitized.userAgent) {
        sanitized.userAgent = sanitized.userAgent.substring(0, 50) + '...';
      }
    }

    return sanitized;
  }

  private hashSensitiveData(data: string): string {
    // Simple hash for demonstration - use proper hashing in production
    return `hash_${data.length}_${data.charCodeAt(0)}`;
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print for development
      console.log(`[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.category}] ${entry.message}`);
      if (entry.context) {
        console.log('Context:', entry.context);
      }
      if (entry.error) {
        console.error('Error:', entry.error);
      }
      if (entry.metadata) {
        console.log('Metadata:', entry.metadata);
      }
    } else {
      // Structured JSON for production
      console.log(JSON.stringify(entry));
    }

    // TODO: Send to external logging service
    // this.sendToExternalService(entry);
  }

  // TODO: Implement external service integration
  // private async sendToExternalService(entry: LogEntry): Promise<void> {
  //   try {
  //     // Send to DataDog, CloudWatch, etc.
  //     await externalLoggingService.send(entry);
  //   } catch (error) {
  //     // Fallback logging - don't let logging errors break the app
  //     console.error('Failed to send log to external service:', error);
  //   }
  // }

  public log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, category, message, context, error, metadata);
    this.output(entry);
  }

  // Convenience methods
  public error(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.ERROR, category, message, context, error, metadata);
  }

  public warn(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.WARN, category, message, context, undefined, metadata);
  }

  public info(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.INFO, category, message, context, undefined, metadata);
  }

  public debug(
    message: string,
    category: LogCategory = LogCategory.SYSTEM,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.DEBUG, category, message, context, undefined, metadata);
  }

  // Security-specific logging methods
  public security(
    message: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.WARN, LogCategory.SECURITY, message, context, undefined, metadata);
  }

  public authenticationFailure(
    message: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.WARN, LogCategory.AUTHENTICATION, `Authentication failure: ${message}`, context, undefined, metadata);
  }

  public authorizationFailure(
    message: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.WARN, LogCategory.AUTHORIZATION, `Authorization failure: ${message}`, context, undefined, metadata);
  }

  public rateLimitExceeded(
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.WARN, LogCategory.SECURITY, 'Rate limit exceeded', context, undefined, metadata);
  }

  public suspiciousActivity(
    message: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.ERROR, LogCategory.SECURITY, `Suspicious activity detected: ${message}`, context, undefined, metadata);
  }

  // API logging
  public apiRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const message = `${method} ${url} - ${statusCode} (${duration}ms)`;
    const apiContext = {
      ...context,
      method,
      url,
      statusCode,
      duration
    };
    
    const level = statusCode >= 500 ? LogLevel.ERROR : 
                  statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    
    this.log(level, LogCategory.API, message, apiContext);
  }

  // Performance logging
  public performance(
    operation: string,
    duration: number,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    const message = `Performance: ${operation} took ${duration}ms`;
    const perfContext = { ...context, duration };
    
    const level = duration > 5000 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, LogCategory.PERFORMANCE, message, perfContext, undefined, metadata);
  }

  // Business logic logging
  public business(
    event: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    this.log(LogLevel.INFO, LogCategory.BUSINESS, `Business event: ${event}`, context, undefined, metadata);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Helper function to create request context for logging
export function createLogContext(request: Request, additionalData?: Record<string, any>): LogContext {
  const url = new URL(request.url);
  
  return {
    requestId: crypto.randomUUID(),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: url.pathname,
    method: request.method,
    additionalData
  };
}

// Performance measurement helper
export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now();
  
  return fn().then(
    (result) => {
      const duration = Date.now() - start;
      logger.performance(operation, duration, context);
      return result;
    },
    (error) => {
      const duration = Date.now() - start;
      logger.performance(`${operation} (failed)`, duration, context);
      throw error;
    }
  );
} 