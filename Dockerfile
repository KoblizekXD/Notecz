ARG BUN_VERSION=1.1.13
ARG NODE_VERSION=20.12.2
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-slim

# FUCK YOU
USER root
WORKDIR /app
RUN chmod 777 /app

# Run as a non-privileged user
# RUN useradd -ms /bin/bash -u 1001 appuser
# USER appuser

COPY package.json bun.lockb tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs ./
RUN bun install
COPY ./prisma/ ./prisma/
RUN bunx prisma generate

# Copy source files into application directory
COPY --chown=root /src /app/src
RUN bun run build
RUN mkdir --parents ./.next/standalone/public/_next/static 
COPY ./public ./.next/standalone/public
RUN cp ./.next/static -r ./.next/standalone/public/_next
RUN rm -rf ./src
RUN rm -rf ./node_modules

# set env
ENV PORT=3000
ENV NODE_ENV=production

CMD ["bun", "run", "standalone"]