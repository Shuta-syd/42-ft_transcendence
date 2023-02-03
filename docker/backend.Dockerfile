FROM node:latest

WORKDIR /backend

COPY scripts/backend/entrypoint.sh /

RUN apt-get -y update

RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli
RUN npm update


RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
