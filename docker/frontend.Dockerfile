FROM node:18.14.0

WORKDIR /frontend

COPY scripts/frontend/entrypoint.sh /

RUN apt-get -y update

RUN npm install -g npm@latest
RUN npm install -g npm-check-updates
RUN npm update


RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
