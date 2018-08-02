FROM node:alpine
WORKDIR "/app"
COPY package.json ./
RUN npm install
COPY . .

ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}

CMD ["npm", "run", "start"]