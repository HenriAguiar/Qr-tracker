FROM node:18

WORKDIR /app
RUN echo '<h1>Frontend funcionando!</h1>' > index.html
RUN npm install -g serve

CMD ["serve", "-s", ".", "-l", "3000"]