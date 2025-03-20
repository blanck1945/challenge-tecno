# Etapa de construcción
FROM node:16-alpine AS build  

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

#---

# Etapa de producción
FROM nginx:alpine

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
