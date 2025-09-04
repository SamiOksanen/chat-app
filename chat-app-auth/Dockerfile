FROM node:22

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --silent
RUN npm i -g nodemon --no-optional --silent
COPY . ./

CMD ["nodemon", "index.js"]