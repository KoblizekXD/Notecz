FROM oven/bun:debian

# Run as a non-privileged user
RUN useradd -ms /bin/bash -u 1001 appuser
USER appuser

WORKDIR /app
COPY package.json bun.lockb ./
#TODO: na produkci nestahovat devdependencies
RUN bun install --production

# Copy source files into application directory
COPY --chown=appuser:appuser /src /app/src

# set env
ENV PORT=3000
ENV NODE_ENV=production

#TODO: ne
# COPY .env.local ./ 