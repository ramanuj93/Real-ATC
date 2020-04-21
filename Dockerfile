# pull official base image
FROM node:10.20.1

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install pm2 -g

EXPOSE 80

# add app
COPY . ./


# start app
CMD ["pm2-runtime", "start", "ecosystem.config.js"]