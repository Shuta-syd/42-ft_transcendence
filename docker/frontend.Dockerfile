FROM node:latest

WORKDIR /frontend

EXPOSE 3000

RUN apt-get -y update
RUN npm ci

CMD ["npm", "run", "start"]
