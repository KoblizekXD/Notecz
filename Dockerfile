FROM oven/bun:debian

# FUCK YOU
USER root
WORKDIR /app
RUN chmod 777 /app

# Run as a non-privileged user
# RUN useradd -ms /bin/bash -u 1001 appuser
# USER appuser

COPY package.json bun.lockb ./
#TODO: na produkci nestahovat devdependencies
RUN bun install --production

# Copy source files into application directory
COPY --chown=root /src /app/src

# set env
ENV PORT=3000
ENV NODE_ENV=production

#TODO: ne
# COPY .env.local ./ 
CMD ["bun", "src/index.ts"]