# Step 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copy source files and build Angular app
COPY . .
RUN ng build --configuration production

# Step 2: Serve with Nginx
FROM nginx:alpine
# Use /browser if Angular 17+, otherwise remove it
COPY --from=build /app/dist/docassist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
