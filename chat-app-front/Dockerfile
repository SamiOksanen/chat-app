FROM node:16

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --silent
RUN npm i react-scripts -g --silent
COPY . ./

CMD [ "npm", "run", "start" ]