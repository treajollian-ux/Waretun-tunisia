FROM node:16-alpine

RUN apk add --no-cache wireguard-tools iptables

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000 51820/udp

CMD ["npm", "start"]
