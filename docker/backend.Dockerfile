FROM node:latest

WORKDIR /backend

RUN apt-get -y update
RUN npm ci


CMD ["npm", "run", "start:dev"]
