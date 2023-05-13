FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache app.ts

CMD ["run", "-A", "app.ts"]
