FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ARG VITE_FORMSUBMIT_EMAIL
ENV VITE_FORMSUBMIT_EMAIL=$VITE_FORMSUBMIT_EMAIL

RUN npm run build

ENV NODE_ENV=production

EXPOSE 4173

CMD ["npm", "run", "preview"]