import { NextRequest, NextResponse } from 'next/server';
import { logger, LogCategory } from '@/lib/logger';

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // Per window
  RATE_LIMIT_API_MAX_REQUESTS: 20, // For API routes
  
  // Request size limits
  MAX_REQUEST_SIZE: 1024 * 1024, // 1MB
  MAX_URL_LENGTH: 2048,
  MAX_HEADER_SIZE: 8192,
  
  // Security patterns
  SUSPICIOUS_PATTERNS: [
    // SQL injection attempts
    /(\b(union|select|insert|delete|drop|create|alter|exec|execute)\b.*\b(from|into|table|database)\b)/i,
    // XSS attempts
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    // Path traversal
    /\.\.\//g,
    /\.\.\\/g,
    // Command injection
    /[;&|`$(){}[\]]/,
    // Suspicious user agents
    /sqlmap|nikto|nmap|masscan|nessus|openvas|w3af|skipfish|sqlninja/i
  ],
  
  // Blocked user agents
  BLOCKED_USER_AGENTS: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /postman/i
  ],
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://vanguard-ia.tech',
    'https://www.vanguard-ia.tech'
  ]
};

// In-memory stores (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const suspiciousActivityStore = new Map<string, { count: number; lastActivity: number }>();

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  return cfConnectingIP || realIP || forwarded?.split(',')[0] || 'unknown';
}

function isRateLimited(ip: string, isAPI: boolean = false): boolean {
  const now = Date.now();
  const maxRequests = isAPI ? SECURITY_CONFIG.RATE_LIMIT_API_MAX_REQUESTS : SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS;
  
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
    return false;
  }
  
  entry.count++;
  
  if (entry.count > maxRequests) {
    return true;
  }
  
  return false;
}

function containsSuspiciousPatterns(input: string): boolean {
  return SECURITY_CONFIG.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

function isBlockedUserAgent(userAgent: string): boolean {
  return SECURITY_CONFIG.BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

function trackSuspiciousActivity(ip: string, reason: string): void {
  const now = Date.now();
  const entry = suspiciousActivityStore.get(ip) || { count: 0, lastActivity: 0 };
  
  entry.count++;
  entry.lastActivity = now;
  suspiciousActivityStore.set(ip, entry);
  
  logger.security(`Suspicious activity detected from ${ip}: ${reason}`, {
    ip
  }, {
    suspiciousActivityCount: entry.count,
    reason,
    timestamp: new Date().toISOString()
  });
  
  // Block IP if too many suspicious activities
  if (entry.count > 10) {
    logger.security(`IP ${ip} blocked due to excessive suspicious activity`, {
      ip
    }, {
      suspiciousActivityCount: entry.count
    });
  }
}

function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
    return false;
  }
  return true;
}

function validateHeaders(request: NextRequest): { valid: boolean; reason?: string } {
  const headers = request.headers;
  
  // Check for suspicious headers
  const suspiciousHeaders = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url'];
  for (const header of suspiciousHeaders) {
    const value = headers.get(header);
    if (value && containsSuspiciousPatterns(value)) {
      return { valid: false, reason: `Suspicious header: ${header}` };
    }
  }
  
  // Check header size
  let totalHeaderSize = 0;
  headers.forEach((value, key) => {
    totalHeaderSize += key.length + value.length;
  });
  
  if (totalHeaderSize > SECURITY_CONFIG.MAX_HEADER_SIZE) {
    return { valid: false, reason: 'Headers too large' };
  }
  
  return { valid: true };
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Additional security headers not covered in next.config.mjs
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  
  return response;
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const url = request.nextUrl;
  const isAPI = url.pathname.startsWith('/api/');
  
  try {
    // Log request
    logger.info(`${request.method} ${url.pathname}`, LogCategory.API, {
      ip,
      userAgent: userAgent.substring(0, 100), // Truncate for logging
      method: request.method,
      url: url.pathname
    });
    
    // 1. Validate request size
    if (!validateRequestSize(request)) {
      trackSuspiciousActivity(ip, 'Request too large');
      return new NextResponse('Request too large', { status: 413 });
    }
    
    // 2. Validate URL length
    if (url.href.length > SECURITY_CONFIG.MAX_URL_LENGTH) {
      trackSuspiciousActivity(ip, 'URL too long');
      return new NextResponse('URL too long', { status: 414 });
    }
    
    // 3. Check for suspicious patterns in URL
    if (containsSuspiciousPatterns(url.pathname + url.search)) {
      trackSuspiciousActivity(ip, 'Suspicious URL pattern');
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // 4. Validate headers
    const headerValidation = validateHeaders(request);
    if (!headerValidation.valid) {
      trackSuspiciousActivity(ip, headerValidation.reason!);
      return new NextResponse('Bad Request', { status: 400 });
    }
    
    // 5. Check user agent
    if (isBlockedUserAgent(userAgent)) {
      trackSuspiciousActivity(ip, 'Blocked user agent');
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // 6. Rate limiting
    if (isRateLimited(ip, isAPI)) {
      logger.rateLimitExceeded({
        ip,
        userAgent,
        url: url.pathname,
        method: request.method
      });
      
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '900' // 15 minutes
        }
      });
    }
    
    // 7. CORS handling for API routes
    if (isAPI && request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      const isAllowedOrigin = origin && SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin);
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    // Continue to the next middleware/route
    const response = NextResponse.next();
    
    // Add security headers
    const secureResponse = addSecurityHeaders(response);
    
    // Log response
    const duration = Date.now() - startTime;
    logger.apiRequest(request.method, url.pathname, 200, duration, {
      ip,
      userAgent: userAgent.substring(0, 100)
    });
    
    return secureResponse;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Middleware error', LogCategory.SECURITY, {
      ip,
      userAgent,
      url: url.pathname,
      method: request.method,
      duration
    }, error as Error);
    
    trackSuspiciousActivity(ip, 'Middleware error');
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 