# Backend Dockerfile
FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Expose API
EXPOSE 4000

CMD ["npm", "start"]