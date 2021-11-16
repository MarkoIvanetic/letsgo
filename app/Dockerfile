ARG CMC_API_KEY
ARG API_PORT
ARG NODE_VERSION=16

FROM node:$NODE_VERSION-alpine

WORKDIR /app

COPY ./ /app
RUN NODE_ENV=development npm install

EXPOSE 3000
CMD NODE_ENV=development npm run dev