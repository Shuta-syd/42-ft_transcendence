FROM node:18.14.0

WORKDIR /frontend

# package.jsonをコンテナにコピー
COPY ./frontend/package.json ./frontend/package-lock.json /frontend//
RUN npm install -g npm@latest
RUN npm install -g npm-check-updates
RUN npm update
RUN npm install

# ソースコードをコンテナにコピー
COPY ./frontend /frontend
COPY ./docker/scripts/frontend/entrypoint.sh /

RUN apt-get -y update
RUN npm run build

RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
