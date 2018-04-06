FROM node:8.9-alpine AS build

RUN apk update && \
    apk add git

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install
ENV NODE_ENV production

# Everything above should be cached by docker. The below should run on every build

COPY . /app/
RUN git log -n1 --pretty="Commit Date: %aD%nBuild Date: `date --rfc-2822`%n%h %an%n%s%n" > public/round-table.txt && \
    npm run compile && \
    rm -rf node-modules && \
    npm install --no-optional --production && \
    rm -rf /app/.npm /app/.git

FROM node:8.9-alpine
MAINTAINER Quintype Developers <dev-core@quintype.com>

RUN apk update && \
    apk add curl tini && \
    addgroup -S app && \
    adduser -S -g app app

ENV NODE_ENV production
WORKDIR /app
USER app

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "start.js"]

COPY --from=build --chown=app:app /app /app
