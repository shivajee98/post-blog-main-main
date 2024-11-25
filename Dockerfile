# Base image for Node.js
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the build files
FROM nginx:latest

# Copy built files from the first stage
COPY --from=0 /app/dist /usr/share/nginx/html

# Add custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for frontend
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
