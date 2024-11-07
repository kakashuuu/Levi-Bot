FROM node:lts-buster

WORKDIR /app/
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y ffmpeg
COPY . /app/.
RUN yarn install --frozen-lockfile
RUN yarn build
COPY . /app
CMD ["yarn", "start"]
