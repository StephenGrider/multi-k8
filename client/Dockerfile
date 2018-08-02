FROM node:alpine as builder
WORKDIR '/app'
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

FROM nginx
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
