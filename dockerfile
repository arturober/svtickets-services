FROM node:20-alpine
WORKDIR /svtickets-services
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
RUN npm prune --omit=dev
CMD ["node", "dist/main"]
