FROM node:12.14.0-alpine

RUN apk --no-cache add ca-certificates build-base autoconf automake zlib bash libltdl libtool zlib-dev nasm libpng-dev

WORKDIR /client

COPY client/package.json ./
COPY client/yarn.lock ./

RUN yarn

COPY client/config/ ./config

RUN yarn run rollup-config

COPY client/src/ ./src

RUN yarn run build

WORKDIR /

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY .babelrc ./
COPY src/ ./src
COPY .env ./

RUN yarn run build

EXPOSE 80

CMD [ "yarn", "start" ]