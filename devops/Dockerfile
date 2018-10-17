FROM node:8-alpine
WORKDIR /home
COPY package.json /home
RUN npm install
COPY . /home
CMD ["npm", "run", "prod"]
