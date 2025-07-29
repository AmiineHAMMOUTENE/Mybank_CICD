# Use the Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for Next.js build
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/api

# Build the Next.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
