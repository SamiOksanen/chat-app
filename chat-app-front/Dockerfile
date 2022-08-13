FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --silent
COPY . ./

CMD [ "npm", "run", "start" ]