FROM node:8-alpine
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN mkdir /root/logs && \
    npm install 
COPY . .
EXPOSE 8090
