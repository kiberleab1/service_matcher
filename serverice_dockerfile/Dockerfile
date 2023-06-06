FROM node:18-alpine

RUN ["mkdir", "/install"]

ADD ["./package.json", "/install"]
WORKDIR /install
RUN npm install --verbose
ENV NODE_PATH=/install/node_modules

WORKDIR /home/node/app
COPY . /home/node/app