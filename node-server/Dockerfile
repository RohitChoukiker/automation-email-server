FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install only production dependencies for smaller image
COPY package*.json ./
# Use npm install and omit dev deps to avoid `npm ci` lockfile mismatch
# `npm ci` requires lockfile to be in sync; using `npm install --omit=dev`
# is more tolerant across different npm versions/environments.
RUN npm install --omit=dev --no-audit --no-fund

# Copy app source
COPY . .

# Cloud Run sets the PORT environment variable; keep NODE_ENV=production
ENV NODE_ENV=production

# Listen on the port Cloud Run provides (it injects a PORT env var)
EXPOSE 8080

CMD ["node", "server.js"]
