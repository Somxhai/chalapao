# Build Stage
FROM denoland/deno:latest AS builder

# Create working directory
WORKDIR /app

# Copy source
COPY . .

# Compile the main app
RUN deno cache main.ts

# Production stage
FROM denoland/deno:latest
WORKDIR /app
COPY --from=builder /app .
CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read", "--allow-write", "--env-file=.env", "main.ts"]
