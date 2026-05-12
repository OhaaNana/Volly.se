FROM oven/bun:latest
WORKDIR /zero-bug-heroe
COPY package.json bun.lock ./s
RUN bun install --frozen-lockfile
COPY . .
CMD [ "bun", "run", "start" ]