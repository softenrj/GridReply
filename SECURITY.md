# Security Policy

## Reporting Security Vulnerabilities

GridReply takes security seriously. If you discover a security vulnerability, please **do not** open a public GitHub issue. Instead, please report it responsibly.

### How to Report a Vulnerability

**Please email your security report to:**

📧 **rjsharmase@gmail.com**

**In your report, include:**

1. **Description** - Detailed description of the vulnerability
2. **Location** - Where in the code the vulnerability exists
3. **Impact** - What could an attacker do with this vulnerability?
4. **Reproduction Steps** - How to reproduce the issue
5. **Suggested Fix** - Optional, but appreciated
6. **Contact Information** - How to reach you

### Response Timeline

- **Acknowledgment**: Within 24-48 hours
- **Initial Assessment**: Within 1 week
- **Fix Development**: Varies based on severity
- **Patch Release**: As soon as fix is ready
- **Disclosure**: After fix is released

### Severity Levels

**Critical (Immediate Action Required)**
- Remote code execution
- Authentication bypass
- Data breach potential
- Server compromise

**High (Urgent)**
- Privilege escalation
- SQL injection
- Cross-site scripting
- Unauthorized access

**Medium (Important)**
- Information disclosure
- Denial of service
- Session hijacking

**Low (Minor)**
- Minor information disclosure
- Limited impact attacks
- Non-exploitable edge cases

---

## Security Best Practices for Users

### API Key Management
- Never commit secrets to version control
- Use environment variables for sensitive data
- Rotate JWT secrets regularly
- Use `.env.local` files (add to `.gitignore`)

### Database Security
- Use strong MongoDB passwords
- Restrict database access
- Enable MongoDB authentication
- Use connection string encryption

### Frontend Security
- Keep dependencies updated
- Sanitize user inputs
- Use HTTPS in production
- Implement proper CORS settings

### Production Deployment
- Use environment-specific configurations
- Enable HTTPS/TLS
- Set secure cookie flags
- Implement rate limiting
- Use authentication for sensitive endpoints
- Enable CSRF protection
- Validate all inputs server-side

---

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|------------------|
| 1.0.x   | Current | ✅ Yes |
| < 1.0   | Deprecated | ❌ No |

---

## Known Security Considerations

### Educational License
- This is an educational project with an educational license
- For production/commercial use, get explicit permission
- Review security implications before deployment

### Dependencies
- Keep all dependencies updated
- Monitor for vulnerability advisories
- Use `npm audit` regularly

```bash
npm audit
npm audit fix
```

---

## Security Headers

For production deployment, ensure these security headers are set:

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Environment Variables Security

**Never expose these in code:**

```env
# ❌ NEVER commit these to version control
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
API_KEYS=...
```

**Instead, use `.env.local`:**

```bash
# Add to .gitignore
echo ".env.local" >> .gitignore

# Create .env.local with secrets
touch .env.local
```

---

## Responsible Disclosure

We appreciate responsible disclosure and will:

✅ Acknowledge receipt of your report  
✅ Work quickly to develop a fix  
✅ Keep you informed of progress  
✅ Credit you in the security advisory (optional)  
✅ Coordinate public disclosure timing  

We ask that you:

✅ Allow reasonable time for a fix (typically 7-30 days)  
✅ Not publicly disclose until we've patched  
✅ Not access others' data or systems  
✅ Not perform denial-of-service attacks  
✅ Act in good faith  

---

## Acknowledgments

Security researchers who responsibly disclose vulnerabilities will be publicly acknowledged in our Security Advisories (unless they prefer anonymity).

---

## Contact

**For Security Issues:**
- Email: rjsharmase@gmail.com
- Subject: **[SECURITY]** Vulnerability Report

**For Other Inquiries:**
- GitHub: https://github.com/softenrj/GridReply
- General Email: rjsharmase@gmail.com

---

## Legal

By responsibly reporting security vulnerabilities, you understand and agree that:

1. You have discovered a genuine security issue
2. You have not accessed unauthorized systems or data
3. You will not publicly disclose until notified by us
4. You are acting in good faith to help improve security

---

**Last Updated:** September 2026

**Thank you for helping keep GridReply secure!** 🔒
