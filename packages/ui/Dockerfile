# syntax = docker/dockerfile:experimental

##
## Base node image used to set up the production build
##
FROM node:18-alpine as builder
WORKDIR /usr/src/app

##
## Add all files from the current directory (if you need to ignore anything, you can use .dockerignore)
##
ADD . .

##
## This is needed as the install state will be invalid otherwise
##
RUN yarn install
RUN rm -rf .yarn/cache
##
## Change working directory to the workspace we want to build
##
#WORKDIR packages/api

##
## Optionally run a `build` script to compile (tsc, babel, etc) the source files to /packages/backend-api/dist
##
RUN yarn build


##
## Expose our port and run the production app, assumes `backend-api/package.json` has a script named `start:prod`
##
#EXPOSE 3000
CMD ["yarn", "start"]