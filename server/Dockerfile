# ---- Étape 1 : installation des dépendances ----
    FROM node:25-alpine AS deps

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    # ---- Étape 2 : image finale légère ----
    FROM node:25-alpine
    
    WORKDIR /app
    
    # Copier les dépendances et le code source
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Ne pas tourner en root
    USER node
    
    EXPOSE 3000
    
    CMD ["node", "server.js"]