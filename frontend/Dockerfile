ARG MODE

FROM node:18.3.0-alpine as base

WORKDIR /app

COPY package.json .
COPY yarn.lock .

COPY . .

FROM base as build-dev
RUN yarn install
CMD ["yarn", "start"]

FROM base as build-prod
RUN yarn build

FROM build-${MODE} as final

EXPOSE 80