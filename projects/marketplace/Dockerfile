FROM node:14 as build-stage

WORKDIR /root/app
COPY . /root/app/
RUN npm ci
RUN npm run build:marketplace -- --prod

FROM nginx:1.15

COPY --from=build-stage /root/app/dist/marketplace/ /usr/share/nginx/html/marketplace/
