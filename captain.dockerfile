FROM node:lts-alpine
COPY package*.json /usr/src/app/
RUN set -x \
  && cd /usr/src/app \
  && apk update \
  && apk upgrade \
  && npm ci \
  && echo
WORKDIR /usr/src/app
COPY ./ /usr/src/app
RUN set -x \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /usr/share/man /tmp/* \
  && echo
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]
