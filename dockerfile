FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/

# Build the project
RUN npm run build

# Copy the cloud server entry point
COPY cloud-server-simple.js ./

# Create necessary directories
RUN mkdir -p /tmp/.claude-code-router

# Expose port (can be overridden by PORT env var)
EXPOSE 3456

# Start the server
CMD ["node", "cloud-server-simple.js"]
