FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 4173

CMD ["npm", "run", "preview"]