# OpenTTD Coopetition Campaign Editor Dockerfile
# Multi-stage build for production deployment

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies for building
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application for SPA mode
ENV NUXT_SPA_MODE=true
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S campaign-editor -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=campaign-editor:nodejs /app/.output ./

# Create campaigns directory and set permissions
RUN mkdir -p /app/campaigns && chown -R campaign-editor:nodejs /app/campaigns

# Expose port
EXPOSE 3000

# Set user
USER campaign-editor

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node --input-type=module --eval="
    import { request } from 'http';
    const req = request('http://localhost:3000', { timeout: 5000 }, (res) => {
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
    req.on('error', () => process.exit(1));
    req.on('timeout', () => process.exit(1));
    req.end();
  "

# Start the application
CMD ["dumb-init", "node", "server/index.mjs"]