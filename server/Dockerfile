FROM node:16-alpine AS build

RUN apk update && \
  apk add git

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install
ENV NODE_ENV production

# Everything above should be cached by docker. The below should run on every build

COPY . /app/
RUN npm run build:main && \
  rm -rf node-modules && \
  npm install --no-optional --production && \
  mv node_modules public views package.json package-lock.json config build/main

FROM node:16-alpine
MAINTAINER Quintype Developers <dev-core@quintype.com>

RUN apk update && \
  apk add curl tini && \
  addgroup -S app && \
  adduser -S -g app app

ENV NODE_ENV production
ENV PORT 3000
WORKDIR /app
USER app

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "start.js"]

COPY --from=build --chown=app:app /app/build/main /app
