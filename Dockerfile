FROM node:23-alpine

# Python3, make, g++ 설치 (node-gyp 의존성 해결)
RUN apk add --no-cache python3 py3-pip make g++

RUN npm install -g npm@11.1.0

RUN npm install -g env-cmd

WORKDIR /app

COPY package*.json ./

# Python 경로 설정 후 npm install 실행
ENV PYTHON=/usr/bin/python3
RUN npm install

COPY . .

EXPOSE 3000 2984

RUN npm run build

CMD ["npm", "run", "start"]