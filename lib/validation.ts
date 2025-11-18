// Enhanced Input Validation and Sanitization
// Based on OWASP security best practices

import validator from 'validator';
type AdvancedSanitizeOptions = {
  normalizeWhitespace?: boolean;
};

const stripScripts = (value: string) =>
  value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

const stripTags = (value: string) => value.replace(/<[^>]+>/g, '');

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const sanitizeAdvancedInternal = (input: string, options: AdvancedSanitizeOptions = {}) => {
  const normalizeWhitespace = options.normalizeWhitespace ?? true;

  let cleaned = input;

  cleaned = stripScripts(cleaned);
  cleaned = stripTags(cleaned);
  cleaned = validator.stripLow(cleaned, true);
  cleaned = cleaned.replace(/[<>"'`]/g, '');
  cleaned = validator.escape(cleaned);

  if (normalizeWhitespace) {
    cleaned = collapseWhitespace(cleaned);
  }

  return cleaned;
};

export interface ValidationOptions {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  customPattern?: RegExp;
  customValidator?: (value: string) => boolean;
  sanitize?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
}

export class InputValidator {

  // Basic sanitization - removes dangerous characters and patterns
  static sanitizeBasic(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .trim()
      // Remove null bytes
      .replace(/\0/g, '')
      // Remove control characters except newlines and tabs
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Remove potential script injections
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Remove HTML/XML tags
      .replace(/<[^>]*>/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Advanced sanitization using DOMPurify
  static sanitizeAdvanced(input: string): string {
    if (!input || typeof input !== 'string') return '';

    const sanitized = sanitizeAdvancedInternal(this.sanitizeBasic(input));

    return sanitized;
  }

  // Validate and sanitize name input
  static validateName(name: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const opts = {
      minLength: 1,
      maxLength: 100,
      allowEmpty: false,
      sanitize: true,
      ...options
    };

    if (!name || typeof name !== 'string') {
      errors.push('Name must be a valid string');
      return { isValid: false, errors };
    }

    const sanitizedName = opts.sanitize ? this.sanitizeAdvanced(name) : name;

    // Length validation
    if (!opts.allowEmpty && sanitizedName.length === 0) {
      errors.push('Name cannot be empty');
    }
    if (sanitizedName.length < (opts.minLength ?? 1)) {
      errors.push(`Name must be at least ${opts.minLength ?? 1} characters`);
    }
    if (sanitizedName.length > (opts.maxLength ?? 100)) {
      errors.push(`Name must be less than ${opts.maxLength ?? 100} characters`);
    }

    // Pattern validation - only letters, spaces, hyphens, apostrophes, and periods
    const namePattern = /^[a-zA-Z\s\-'.]+$/;
    if (sanitizedName && !namePattern.test(sanitizedName)) {
      errors.push('Name contains invalid characters. Only letters, spaces, hyphens, apostrophes, and periods are allowed');
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousPatterns(sanitizedName)) {
      errors.push('Name contains potentially malicious content');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitizedName,
      errors
    };
  }

  // Validate and sanitize email input
  static validateEmail(email: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const opts = {
      maxLength: 254, // RFC 5321 limit
      allowEmpty: false,
      sanitize: true,
      ...options
    };

    if (!email || typeof email !== 'string') {
      errors.push('Email must be a valid string');
      return { isValid: false, errors };
    }

    let sanitizedEmail = opts.sanitize ? this.sanitizeBasic(email) : email;
    sanitizedEmail = sanitizedEmail.toLowerCase().trim();

    // Length validation
    if (!opts.allowEmpty && sanitizedEmail.length === 0) {
      errors.push('Email cannot be empty');
    }
    if (sanitizedEmail.length > (opts.maxLength ?? 254)) {
      errors.push(`Email must be less than ${opts.maxLength ?? 254} characters`);
    }

    // Email format validation using validator.js
    if (sanitizedEmail && !validator.isEmail(sanitizedEmail, {
      allow_utf8_local_part: false,
      require_tld: true,
      allow_ip_domain: false,
      domain_specific_validation: true,
      blacklisted_chars: '<>()[]\\,;:@"'
    })) {
      errors.push('Invalid email format');
    }

    // Additional security checks
    if (sanitizedEmail) {
      // Check for suspicious patterns
      if (this.containsSuspiciousPatterns(sanitizedEmail)) {
        errors.push('Email contains potentially malicious content');
      }

      // Check for common disposable email domains (optional)
      if (this.isDisposableEmail(sanitizedEmail)) {
        errors.push('Disposable email addresses are not allowed');
      }
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitizedEmail,
      errors
    };
  }

  // Validate and sanitize message input
  static validateMessage(message: string, options: ValidationOptions = {}): ValidationResult {
    const errors: string[] = [];
    const opts = {
      minLength: 10,
      maxLength: 2000,
      allowEmpty: false,
      sanitize: true,
      ...options
    };

    if (!message || typeof message !== 'string') {
      errors.push('Message must be a valid string');
      return { isValid: false, errors };
    }

    const sanitizedMessage = opts.sanitize ? this.sanitizeAdvanced(message) : message;

    // Length validation
    if (!opts.allowEmpty && sanitizedMessage.trim().length === 0) {
      errors.push('Message cannot be empty');
    }
    if (sanitizedMessage.length < (opts.minLength ?? 10)) {
      errors.push(`Message must be at least ${opts.minLength ?? 10} characters`);
    }
    if (sanitizedMessage.length > (opts.maxLength ?? 2000)) {
      errors.push(`Message must be less than ${opts.maxLength ?? 2000} characters`);
    }

    // Content validation
    if (sanitizedMessage) {
      // Check for suspicious patterns
      if (this.containsSuspiciousPatterns(sanitizedMessage)) {
        errors.push('Message contains potentially malicious content');
      }

      // Check for spam patterns
      if (this.containsSpamPatterns(sanitizedMessage)) {
        errors.push('Message appears to be spam');
      }

      // Check for excessive repetition
      if (this.hasExcessiveRepetition(sanitizedMessage)) {
        errors.push('Message contains excessive repetition');
      }
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: sanitizedMessage,
      errors
    };
  }

  // Check for suspicious patterns that might indicate malicious intent
  private static containsSuspiciousPatterns(input: string): boolean {
    const suspiciousPatterns = [
      // Script injection attempts
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,

      // SQL injection attempts
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i,

      // Command injection attempts
      /\|\s*\w+/,
      /;\s*\w+/,
      /&&\s*\w+/,
      /\$\(/,
      /`[^`]*`/,

      // Path traversal attempts
      /\.\.\//,
      /\.\.\\/,

      // Protocol handlers
      /file:/i,
      /ftp:/i,
      /ldap:/i,

      // Suspicious encodings
      /%[0-9a-f]{2}/i,
      /\\u[0-9a-f]{4}/i,
      /\\x[0-9a-f]{2}/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  // Check for common spam patterns
  private static containsSpamPatterns(input: string): boolean {
    const spamPatterns = [
      /\b(viagra|cialis|pharmacy|casino|poker|lottery|winner|congratulations)\b/i,
      /\b(click here|act now|limited time|urgent|immediate)\b/i,
      /\b(free money|easy money|make money|earn \$)/i,
      /\b(weight loss|lose weight|diet pills)\b/i,
      /http[s]?:\/\/[^\s]+/g, // Multiple URLs
    ];

    // Check for multiple URLs (potential spam)
    const urlMatches = input.match(/http[s]?:\/\/[^\s]+/g);
    if (urlMatches && urlMatches.length > 2) {
      return true;
    }

    return spamPatterns.some(pattern => pattern.test(input));
  }

  // Check for excessive character repetition
  private static hasExcessiveRepetition(input: string): boolean {
    // Check for more than 5 consecutive identical characters
    const repetitionPattern = /(.)\1{5,}/;
    return repetitionPattern.test(input);
  }

  // Check if email is from a disposable email service
  private static isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'temp-mail.org',
      'throwaway.email'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  // Comprehensive validation for contact form
  static validateContactForm(data: Record<string, unknown>): {
    isValid: boolean;
    sanitizedData?: { name: string; email: string; message: string; captchaToken: string };
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};

    // Validate name
    const nameResult = this.validateName(String(data.name || ''));
    if (!nameResult.isValid) {
      errors.name = nameResult.errors;
    }

    // Validate email
    const emailResult = this.validateEmail(String(data.email || ''));
    if (!emailResult.isValid) {
      errors.email = emailResult.errors;
    }

    // Validate message
    const messageResult = this.validateMessage(String(data.message || ''));
    if (!messageResult.isValid) {
      errors.message = messageResult.errors;
    }

    // Validate captcha token
    const captchaRaw = String(data.captchaToken ?? '');
    const captchaToken = this.sanitizeBasic(captchaRaw);
    if (!captchaToken) {
      errors.captchaToken = ['Captcha verification is required'];
    } else if (captchaToken.length < 10) {
      errors.captchaToken = ['Captcha token appears invalid'];
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      isValid,
      sanitizedData: isValid ? {
        name: nameResult.sanitizedValue ?? '',
        email: emailResult.sanitizedValue ?? '',
        message: messageResult.sanitizedValue ?? '',
        captchaToken
      } : undefined,
      errors
    };
  }
}

// Utility functions for common validation tasks
export const ValidationUtils = {
  // Escape HTML entities
  escapeHtml: (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (s) => map[s]);
  },

  // Validate IP address
  isValidIP: (ip: string): boolean => {
    return validator.isIP(ip);
  },

  // Validate URL
  isValidURL: (url: string): boolean => {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    });
  },

  // Check if string contains only alphanumeric characters
  isAlphanumeric: (str: string): boolean => {
    return validator.isAlphanumeric(str);
  },

  // Normalize and validate phone number
  normalizePhone: (phone: string): string | null => {
    const cleaned = phone.replace(/\D/g, '');
    return validator.isMobilePhone(cleaned) ? cleaned : null;
  }
};
