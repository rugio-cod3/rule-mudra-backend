# Use an official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8090 

# Start the application using npm
CMD ["npm", "run", "start"]

