FROM node:18.11.0
RUN yarn install -g --unsafe-perm prisma

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ARG MYSQL_URL
ENV MYSQL_URL "$MYSQL_URL"

RUN yarn install
RUN yarn prisma db pull
RUN yarn prisma generate

CMD [ "yarn", "start" ]