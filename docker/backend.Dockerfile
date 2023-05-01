FROM node:18.16.0

WORKDIR /backend

# package.jsonをコンテナにコピー
COPY ./backend/package.json ./backend/package-lock.json /backend/
RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli
RUN npm update
RUN npm install

# ソースコードをコンテナにコピー
COPY ./backend /backend
COPY ./docker/scripts/backend/entrypoint.sh /

RUN npx prisma generate
RUN npm run build

RUN apt-get -y update

RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
