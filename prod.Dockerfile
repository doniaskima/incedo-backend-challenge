
# Stage 1: Build the React app
FROM node:14 as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:1.21

# Remove the default Nginx configuration
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the previous stage to the Nginx server's web root
COPY --from=build /app/build /usr/share/nginx/html

# Optionally, you can include a custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]