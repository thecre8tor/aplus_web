FROM rust:1.88 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app

# Copy binary and static assets
COPY --from=builder /app/target/release/aplus_website .
COPY --from=builder /app/static ./static

# Set environment
ENV RUST_LOG=info

EXPOSE 8080

CMD ["./aplus_website"]
