# Build app
FROM node:12 as builder 
LABEL authors="aliyome"
WORKDIR /root
COPY ["./package.json", "./yarn.lock", "./"]
RUN yarn --silent
COPY ["./", "./"]
RUN yarn build 

# Final image
FROM node:12-alpine
WORKDIR /root
RUN apk add curl
COPY ["./package.json", "./yarn.lock", "./"]
RUN yarn --silent --prod
COPY --from=builder /root/lib .
CMD "sh"
