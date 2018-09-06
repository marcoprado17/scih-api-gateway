FROM node:8-alpine
WORKDIR /home
COPY package.json /home
RUN npm install
COPY . /home
EXPOSE 8080
CMD ["npm", "run", "start"]
