# CI/CD and Deployment

This document outlines the complete CI/CD pipeline and deployment strategy for the TodoApp.

## 🚀 GitHub Actions CI/CD Pipeline

### Pipeline Overview

The automated pipeline includes:

1. **Testing & Quality Assurance**
   - Frontend: TypeScript compilation, ESLint, unit tests (Vitest), E2E tests (Cypress)
   - Backend: Maven tests, Jacoco coverage, security scanning
   - Security: Trivy vulnerability scanner

2. **Container Building & Registry**
   - Multi-stage Docker builds for both frontend and backend
   - Automatic image tagging with Git SHA and branch names
   - Push to GitHub Container Registry (ghcr.io)

3. **Deployment Automation**
   - Staging environment deployment on `develop` branch
   - Production deployment on `main` branch
   - Health checks and smoke tests

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings:

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
GITHUB_TOKEN=your_github_token_with_repo_scope
```

## 🐳 Docker Configuration

### Frontend Dockerfile
- Multi-stage build with Node.js 18 Alpine
- Production-optimized Nginx serving
- Health checks included

### Backend Dockerfile
- Multi-stage build with OpenJDK 17
- Slim runtime image for production
- Application JAR optimization

### Docker Compose Files
- `docker-compose.yml` - Local development
- `docker-compose.staging.yml` - Staging environment
- `docker-compose.production.yml` - Production environment with scaling

## 🏗️ Infrastructure as Code

### Terraform Configuration
Located in `infrastructure/` directory:

- **AWS ECS** for container orchestration
- **Application Load Balancer** for traffic distribution
- **RDS PostgreSQL** for database
- **Auto Scaling** based on demand
- **CloudWatch** for monitoring and logging

### Infrastructure Components

1. **VPC & Networking**
   - Private subnets for application
   - Public subnets for load balancer
   - Security groups for isolation

2. **Database**
   - Multi-AZ PostgreSQL RDS
   - Automated backups
   - Encryption at rest

3. **Compute**
   - Fargate for serverless containers
   - Auto-scaling policies
   - Health checks and monitoring

## 🚀 Deployment Scripts

### Automated Deployment Script (`scripts/deploy.sh`)

This script handles:
- Docker image building and pushing
- Terraform infrastructure provisioning
- Health checks and smoke testing

### Usage

```bash
# Set required environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export GITHUB_TOKEN=your_github_token
export JWT_SECRET=your_jwt_secret

# Run deployment
./scripts/deploy.sh
```

## 🔧 Environment Configuration

### Staging Environment
- URL: https://staging.yourapp.com
- Database: Dedicated PostgreSQL instance
- Auto-scaling: Single instance

### Production Environment
- URL: https://yourapp.com
- Database: Multi-AZ PostgreSQL with backups
- Auto-scaling: 2-10 instances based on load
- SSL/TLS termination at load balancer

## 📊 Monitoring & Logging

### Application Monitoring
- **Health Checks**: `/actuator/health` endpoint
- **Metrics**: Spring Boot Actuator with Micrometer
- **Distributed Tracing**: OpenTelemetry integration

### Infrastructure Monitoring
- **CloudWatch**: Container and application metrics
- **CloudWatch Logs**: Centralized log aggregation
- **AWS X-Ray**: Request tracing

### Alerting
- High CPU/memory usage
- Database connection issues
- Application errors (5xx responses)
- Health check failures

## 🔒 Security

### Container Security
- Trivy vulnerability scanning
- Minimal base images (Alpine, distroless)
- Non-root user execution
- Read-only root filesystem where possible

### Network Security
- VPC isolation
- Security groups with least privilege
- SSL/TLS encryption everywhere
- WAF rules for common attacks

### Application Security
- Environment-based secrets management
- JWT token validation
- Input sanitization and validation
- OWASP security headers

## 🚀 Rollback Strategy

### Automatic Rollback
- Health check failures trigger automatic rollback
- Previous stable image is redeployed
- Monitoring alerts notify team

### Manual Rollback
```bash
# Rollback to previous image version
aws ecs update-service \
  --cluster todoapp-production \
  --service todoapp-service \
  --task-definition previous-task-definition
```

## 📈 Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization
- CDN for static assets
- Browser caching strategies

### Backend
- Database connection pooling
- Caching with Redis (optional)
- JVM tuning
- Container resource optimization

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch from `develop`
   - Push code changes
   - Automated tests run on PR

2. **Staging Deployment**
   - Merge to `develop` branch
   - Automatic deployment to staging
   - Manual QA testing

3. **Production Deployment**
   - Create PR from `develop` to `main`
   - Code review and approval
   - Merge to trigger production deployment

## 📋 Checklist for Production Deployment

- [ ] All tests passing
- [ ] Security scan clear
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] Backup strategies in place
- [ ] Monitoring configured
- [ ] Rollback plan documented

## 🆘 Troubleshooting

### Common Issues

1. **Container startup failures**
   - Check CloudWatch logs
   - Verify environment variables
   - Validate health check configuration

2. **Database connection issues**
   - Check security group rules
   - Verify database credentials
   - Test network connectivity

3. **High memory usage**
   - Review container resource limits
   - Check for memory leaks
   - Consider scaling strategy

### Commands for Debugging

```bash
# Check ECS task logs
aws logs tail /ecs/todoapp-backend --follow

# Check service events
aws ecs describe-services --cluster todoapp --services todoapp-service

# Check task definitions
aws ecs list-task-definitions --family-prefix todoapp
```