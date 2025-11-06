// Centralized Error Handling System
// Based on Node.js best practices and OWASP recommendations

export enum ErrorCodes {
  // Client Errors (4xx)
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

export enum ErrorTypes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR'
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: ErrorCodes;
  public readonly errorType: ErrorTypes;
  public readonly isOperational: boolean;
  public readonly context?: ErrorContext;
  public readonly timestamp: string;

  constructor(
    name: string,
    httpCode: ErrorCodes,
    errorType: ErrorTypes,
    description: string,
    isOperational: boolean = true,
    context?: ErrorContext
  ) {
    super(description);

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.errorType = errorType;
    this.isOperational = isOperational;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      httpCode: this.httpCode,
      errorType: this.errorType,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      context: this.context
    };
  }
}

// Specific Error Classes
export class ValidationError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(
      'ValidationError',
      ErrorCodes.UNPROCESSABLE_ENTITY,
      ErrorTypes.VALIDATION_ERROR,
      message,
      true,
      context
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: ErrorContext) {
    super(
      'AuthenticationError',
      ErrorCodes.UNAUTHORIZED,
      ErrorTypes.AUTHENTICATION_ERROR,
      message,
      true,
      context
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: ErrorContext) {
    super(
      'AuthorizationError',
      ErrorCodes.FORBIDDEN,
      ErrorTypes.AUTHORIZATION_ERROR,
      message,
      true,
      context
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', context?: ErrorContext) {
    super(
      'RateLimitError',
      ErrorCodes.TOO_MANY_REQUESTS,
      ErrorTypes.RATE_LIMIT_ERROR,
      message,
      true,
      context
    );
  }
}

export class SecurityError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(
      'SecurityError',
      ErrorCodes.FORBIDDEN,
      ErrorTypes.SECURITY_ERROR,
      message,
      true,
      context
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, context?: ErrorContext) {
    super(
      'ExternalServiceError',
      ErrorCodes.BAD_GATEWAY,
      ErrorTypes.EXTERNAL_SERVICE_ERROR,
      message,
      true,
      context
    );
  }
}

// Error Handler Utility
export class ErrorHandler {
  public static handleError(error: Error, context?: ErrorContext): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Convert unknown errors to AppError
    return new AppError(
      'UnknownError',
      ErrorCodes.INTERNAL_SERVER_ERROR,
      ErrorTypes.BUSINESS_LOGIC_ERROR,
      error.message || 'An unexpected error occurred',
      false,
      context
    );
  }

  public static createErrorResponse(error: AppError, includeStack: boolean = false) {
    const response: any = {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        type: error.errorType,
        timestamp: error.timestamp
      }
    };

    // Include stack trace only in development
    if (includeStack && process.env.NODE_ENV === 'development') {
      response.error.stack = error.stack;
    }

    // Include context if available (be careful not to expose sensitive data)
    if (error.context) {
      response.error.context = {
        requestId: error.context.requestId,
        timestamp: error.context.timestamp,
        // Don't include sensitive data like IP, userAgent in production
        ...(process.env.NODE_ENV === 'development' && {
          ip: error.context.ip,
          userAgent: error.context.userAgent,
          url: error.context.url,
          method: error.context.method
        })
      };
    }

    return response;
  }

  public static logError(error: AppError): void {
    const logData = {
      level: 'error',
      message: error.message,
      name: error.name,
      httpCode: error.httpCode,
      errorType: error.errorType,
      isOperational: error.isOperational,
      timestamp: error.timestamp,
      stack: error.stack,
      context: error.context
    };

    // In production, use structured logging
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with logging service (Winston, Datadog, etc.)
      console.error(JSON.stringify(logData));
    } else {
      console.error('Error occurred:', logData);
    }

    // TODO: Send to monitoring service (Sentry, DataDog, etc.)
    // if (error.httpCode >= 500) {
    //   sentryService.captureException(error);
    // }
  }
}

// Common Error Definitions
export const CommonErrors = {
  VALIDATION_FAILED: (field: string) => new ValidationError(`Validation failed for field: ${field}`),
  INVALID_INPUT: (message: string) => new ValidationError(`Invalid input: ${message}`),
  UNAUTHORIZED_ACCESS: () => new AuthenticationError('Authentication required'),
  INSUFFICIENT_PERMISSIONS: () => new AuthorizationError('Insufficient permissions'),
  RATE_LIMIT_EXCEEDED: () => new RateLimitError('Rate limit exceeded. Please try again later.'),
  RESOURCE_NOT_FOUND: (resource: string) => new AppError(
    'ResourceNotFound',
    ErrorCodes.NOT_FOUND,
    ErrorTypes.BUSINESS_LOGIC_ERROR,
    `${resource} not found`,
    true
  ),
  EXTERNAL_SERVICE_UNAVAILABLE: (service: string) => new ExternalServiceError(
    `External service ${service} is currently unavailable`
  ),
  CONFIGURATION_ERROR: (message: string) => new AppError(
    'ConfigurationError',
    ErrorCodes.INTERNAL_SERVER_ERROR,
    ErrorTypes.CONFIGURATION_ERROR,
    message,
    false
  )
};

// Request Context Helper
export function createRequestContext(request: Request): ErrorContext {
  const url = new URL(request.url);
  
  return {
    requestId: crypto.randomUUID(),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    url: url.pathname,
    method: request.method,
    timestamp: new Date().toISOString()
  };
} 