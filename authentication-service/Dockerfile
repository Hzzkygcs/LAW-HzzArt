# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# Copy the rest of the app's source code to the working directory
COPY . .
RUN rm -rf ./node_modules/bcrypt || true



# Install any needed packages specified in package.json
RUN npm install


# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
