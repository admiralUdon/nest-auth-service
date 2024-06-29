FROM node:18.18.0

COPY . /app/
WORKDIR /app

RUN npm install
RUN npx prisma generate

EXPOSE 3000
CMD npm run start