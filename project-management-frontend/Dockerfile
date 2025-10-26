FROM node:23-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite in dev mode and bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
