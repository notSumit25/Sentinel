# Build from repo root: docker build -f sentinel-frontend/Dockerfile .
# Pass NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY so Next.js build can prerender pages that use Clerk.
# -------- Build stage --------
    FROM node:20-alpine AS builder

    ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    
    WORKDIR /app
    
    # When context is repo root (docker-compose), copy from sentinel-frontend/
    COPY sentinel-frontend/package*.json ./
    RUN npm install
    
    COPY sentinel-frontend/ .
    # Proto for gRPC API route (QueryService definitions)
    COPY QueryService/src/main/proto /app/proto
    
    RUN npm run build
    
    # -------- Runtime stage --------
    FROM node:20-alpine
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/proto ./proto
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    