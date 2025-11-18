# Security Policy

## Supported Versions

We actively maintain security for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email security concerns to the project maintainers
3. Include detailed information about the vulnerability
4. Allow reasonable time for the issue to be addressed

## Security Measures Implemented

### Environment Variables
- All sensitive data is stored in environment variables
- `.env` files are excluded from version control
- Environment variable validation is implemented

### HTTP Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Content Security Policy (CSP)
- X-XSS-Protection

### Code Security
- ESLint security plugin enabled
- TypeScript strict mode
- Input validation with Zod
- Firebase App Check enabled
- Authentication required for sensitive operations

### Dependencies
- Regular dependency audits via `npm audit`
- Security-focused ESLint rules
- Automated vulnerability scanning

## Security Best Practices

### For Developers
1. Never commit sensitive data to version control
2. Use environment variables for all secrets
3. Validate all user inputs
4. Follow the principle of least privilege
5. Keep dependencies updated
6. Run security checks before deployment

### For Deployment
1. Use HTTPS in production
2. Enable Firebase security rules
3. Configure proper CORS policies
4. Monitor for security alerts
5. Regular security audits

## Security Scripts

Run these commands to check security:

```bash
# Run security linting
npm run lint:security

# Check for vulnerabilities
npm run security:audit

# Run all security checks
npm run security:check
```

## Firebase Security

### Authentication
- Email verification required
- App Check enabled for functions
- Proper authentication policies

### Database Rules
- Implement proper Firestore security rules
- Use authenticated user context
- Validate data on server side

## Contact

For security-related questions or concerns, please contact the project maintainers. 