FROM node:10-slim as build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git
USER node
RUN npm install
RUN npm install @angular/cli@7.3.9
COPY --chown=node:node . .
RUN npm run-script build

FROM nginx:1.16.0-alpine
COPY --from=build /home/node/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#/etc/nginx/nginx.conf
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]