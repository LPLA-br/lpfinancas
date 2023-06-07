# syntax=docker/dockerfile:1
FROM node:19
WORKDIR /usr/src/lpfinancas

COPY . .
RUN npm install

EXPOSE 8080

ENTRYPOINT npm start
