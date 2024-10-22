FROM node:14

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000

CMD [ "yarn", "start" ]