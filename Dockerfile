# Use official Node.js slim image
FROM node:20.10-alpine3.19

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy your backend code
COPY . .

# Expose your server port
EXPOSE 3000

# Start your backend directly
CMD ["node", "server/server.js"]
