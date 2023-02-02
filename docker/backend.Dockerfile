FROM node:latest

WORKDIR /backend

RUN apt-get -y update
RUN npm i -g npm@latest
RUN npm i -g @nestjs/cli
RUN npm update

CMD ["npm", "run", "start:dev"]
