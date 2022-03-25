FROM node:14 as build-stage

WORKDIR /root/app
COPY ./ /root/app/
RUN npm i -g npm
RUN npm ci
RUN npm run build:explorer

FROM nginx:1.15

COPY --from=build-stage /root/app/dist/explorer/ /usr/share/nginx/html/
