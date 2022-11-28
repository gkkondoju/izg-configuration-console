FROM node:18.11.0
RUN yarn install -g --unsafe-perm prisma

RUN mkdir /app
WORKDIR /app

COPY ./ ./prisma/

CMD [ "prisma", "dev"]