# Stage 1: Build the React application
# This stage uses a Node.js image to install dependencies and build the static files.
FROM node:18-alpine AS build
WORKDIR /app
# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application source code
COPY . .
# Build the static files for production
RUN npm run build

# Stage 2: Serve the static files with Nginx
# This stage uses a lightweight web server (Nginx) to serve the built files.
FROM nginx:stable-alpine
# Copy the built static files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx listens on port 80 by default
EXPOSE 80
# The command to start the Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]
