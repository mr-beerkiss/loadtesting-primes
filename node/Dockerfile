FROM node:argon

ENV APP_DIR /opt/primes/node

RUN mkdir -p $APP_DIR
WORKDIR $APP_DIR

ADD . $APP_DIR

RUN ["npm", "install"]

CMD ["npm", "start"]

EXPOSE 3001