# --- BUILD STAGE ---
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    ENV NEXTJS_IGNORE_ESLINT_ERRORS=true

    COPY . .
    RUN npm run build
    
    # --- PRODUCTION STAGE ---
    FROM node:20-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app ./
    ENV NODE_ENV=production
    
    # Đặt port Next.js listen là 3001 (khớp với bạn config)
    ENV PORT=3101
    
    EXPOSE 3101
    
    CMD ["npm", "start"]
    