# # Use an official Node.js image as the base
# FROM node

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # Install project dependencies
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Build the Next.js application
# RUN npm run build

# # Expose the default Next.js port (3000)
# EXPOSE 3000

# # Specify the command to run your Next.js application
# CMD ["npm", "start"]

FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/.next ./next

EXPOSE 3000
CMD [ "npm", "start" ]