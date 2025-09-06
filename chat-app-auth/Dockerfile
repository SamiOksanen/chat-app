FROM node:22

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./
RUN npm i --silent
COPY src ./src

CMD ["npm", "run", "dev:watch"]