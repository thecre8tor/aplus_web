# APlus Drivers Website

This repository contains the APlus Drivers marketing site built with [Vite](https://vitejs.dev/) and vanilla JavaScript.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The command starts the Vite dev server. By default it runs on [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

The production-ready files are emitted to the `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for verification.

## Configuration

The booking form can post to an external API configured via environment variables:

```bash
cp .env.example .env
```

Set `VITE_BOOKING_API_URL` to the fully qualified URL of the booking endpoint. When not set, the site submits to `/api/booking`.

## Deployment

1. Run `npm run build`.
2. Deploy the generated `dist/` directory to your static hosting provider (e.g. Render Static Sites).
3. When using Render, configure a build command of `npm run build` and a publish directory of `dist`.

## License

This project is proprietary to APlus Drivers.
