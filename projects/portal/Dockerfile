FROM node:14 as build-stage

WORKDIR /root/app
COPY . /root/app/
RUN npm ci
RUN npm run build:portal -- --prod

FROM nginx:1.15

COPY --from=build-stage /root/app/dist/portal/ /usr/share/nginx/html/portal/
