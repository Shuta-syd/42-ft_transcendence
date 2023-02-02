FROM node:latest

WORKDIR /frontend

RUN apt-get -y update
RUN npm i -g npm@latest
RUN npm update

CMD ["npm", "run"]
