FROM node:10-alpine AS builder

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build && rm -rf node_modules && yarn --production

FROM node:10-alpine
WORKDIR /app
COPY --from=builder /usr/src/app /app

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["yarn", "start"]
