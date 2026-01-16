# cPanel Deployment Checklist

Use this checklist to ensure a smooth deployment to cPanel.

## Pre-Deployment

### Repository Setup
- [ ] Repository created on GitHub/GitLab
- [ ] All code pushed to main branch
- [ ] .env.example file included (without sensitive data)
- [ ] .env file is in .gitignore
- [ ] README.md updated with project info
- [ ] CPANEL_DEPLOYMENT.md reviewed

### Code Configuration
- [ ] FRONTEND_URL added to allowed origins in index.js
- [ ] Google OAuth callback URL updated for production domain
- [ ] All hardcoded URLs replaced with environment variables
- [ ] Error handling implemented
- [ ] Logging configured

### Environment Variables Prepared
- [ ] NODE_ENV=production
- [ ] PORT configured
- [ ] MONGODB_URL with connection string
- [ ] DATABASE_NAME set
- [ ] JWT_SECRET (strong, unique)
- [ ] JWT_REFRESH_SECRET (strong, unique)
- [ ] SESSION_SECRET (strong, unique)
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GOOGLE_CALLBACK_URL (production domain)
- [ ] CLOUDINARY credentials
- [ ] FRONTEND_URL (production domain)

## Database Setup

### MongoDB Configuration
- [ ] MongoDB Atlas account created (or other MongoDB service)
- [ ] Database cluster created
- [ ] Database user created with appropriate permissions
- [ ] Database name matches DATABASE_NAME env var
- [ ] IP whitelist configured (0.0.0.0/0 for testing, specific IPs for production)
- [ ] Connection string tested locally
- [ ] Network access configured

## cPanel Configuration

### Initial Setup
- [ ] cPanel account accessed
- [ ] Domain/subdomain configured and pointing to server
- [ ] SSL certificate installed (Let's Encrypt or custom)

### Node.js Application Setup
- [ ] "Setup Node.js App" accessed in cPanel
- [ ] Application created with:
  - [ ] Correct Node.js version (18+)
  - [ ] Application mode: Production
  - [ ] Application root path set
  - [ ] Application URL configured
  - [ ] Startup file: server.js
  - [ ] Port assigned by cPanel

### Git Deployment Setup
- [ ] "Git Version Control" accessed in cPanel
- [ ] Repository cloned with:
  - [ ] Correct clone URL
  - [ ] Correct repository path (same as app root)
  - [ ] SSH keys configured (if using private repo)

### Environment Variables in cPanel
- [ ] All environment variables added in Node.js App settings
- [ ] Variables match .env.example structure
- [ ] Sensitive values are unique and secure
- [ ] FRONTEND_URL matches actual domain
- [ ] GOOGLE_CALLBACK_URL matches actual domain

## Deployment

### First Deployment
- [ ] Code pushed to repository
- [ ] Repository pulled in cPanel (via Git interface or terminal)
- [ ] Dependencies installed: `npm install --production`
- [ ] Application started via cPanel interface
- [ ] No startup errors in logs

### Testing
- [ ] Base URL accessible (https://yourdomain.com)
- [ ] Health check endpoint working: /api/health
- [ ] API endpoints responding
- [ ] MongoDB connection successful
- [ ] Google OAuth login working
- [ ] Image upload working (Cloudinary)
- [ ] CORS configured correctly
- [ ] HTTPS working (no mixed content warnings)

## Post-Deployment

### Security
- [ ] All default secrets changed
- [ ] MongoDB IP whitelist tightened (if possible)
- [ ] Strong passwords used
- [ ] HTTPS enforced
- [ ] Rate limiting considered
- [ ] Firewall rules reviewed

### Monitoring
- [ ] Application logs accessible
- [ ] Error logging working
- [ ] Health check endpoint monitored
- [ ] MongoDB performance monitored

### Documentation
- [ ] Production URLs documented
- [ ] Environment variables documented (securely)
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Team members informed

## Frontend Integration

### Frontend Configuration
- [ ] Frontend API URL updated to production backend
- [ ] Frontend CORS origin added to backend
- [ ] Frontend deployed (Vercel/Netlify/cPanel)
- [ ] Frontend can communicate with backend
- [ ] Google OAuth working end-to-end

## Troubleshooting Resources

If issues occur, check:
- [ ] Application logs in cPanel
- [ ] MongoDB connection logs
- [ ] Node.js version compatibility
- [ ] Environment variables are set correctly
- [ ] Port conflicts
- [ ] File permissions
- [ ] SSL certificate validity

## Maintenance

### Regular Tasks
- [ ] Monitor application logs weekly
- [ ] Check disk space usage
- [ ] Update dependencies monthly
- [ ] Review security updates
- [ ] Backup database regularly
- [ ] Test backup restoration

### Update Procedure
- [ ] Code changes pushed to repository
- [ ] Git pull in cPanel
- [ ] Run `npm install` if dependencies changed
- [ ] Restart application
- [ ] Verify deployment
- [ ] Monitor for errors

---

## Emergency Contacts

- **Hosting Provider Support**: [Your provider contact]
- **MongoDB Support**: support.mongodb.com
- **Developer Contact**: [Your contact info]

## Useful Commands Reference

```bash
# Check application status
ps aux | grep node

# View logs
tail -f ~/maker-app/logs/combined.log

# Restart application (via cPanel interface or)
pkill -f node && cd ~/maker-app && npm start

# Test MongoDB connection
node ~/maker-app/scripts/testConnection.js

# Check Node.js version
node --version

# Update code from Git
cd ~/maker-app && git pull origin main
```

---

**Date Prepared**: January 2026
**Last Updated**: [Date of last update]
**Deployment Status**: [ ] Not Started | [ ] In Progress | [ ] Complete
