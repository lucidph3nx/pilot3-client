FROM node:10-slim
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN apt-get install git
RUN npm install @angular/cli@7.3.9
RUN npm install
RUN npm run-script build
COPY --chown=node:node . .
EXPOSE 4000
RUN npm start
# CMD [ "node", "server.js" ]