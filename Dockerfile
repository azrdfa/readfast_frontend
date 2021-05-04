FROM node:10
WORKDIR /code
COPY . /code
RUN npm install