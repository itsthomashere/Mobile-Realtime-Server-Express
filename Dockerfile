FROM node:20
RUN npm install -g typescript
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3500
RUN npm run build
CMD [ "npm", "start" ]
