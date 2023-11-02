FROM node:18 as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
 

FROM nginx:latest

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration for your backend (if needed)
COPY ./nginx.conf /etc/nginx/conf.d/

# Copy the built backend application from the first stage to the Nginx web root
COPY --from=build /app /usr/share/nginx/html

# Expose the port for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]