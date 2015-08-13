FROM node:0.12-onbuild

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install --unsafe-perm

CMD [ "npm", "start" ]
