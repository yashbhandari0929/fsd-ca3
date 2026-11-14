/**
 * Request Logging Middleware
 * Captures HTTP method, URL, status code, IP, and round-trip duration in ms
 */
export function requestLogger(req, res, next) {
  const start = performance.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);
    const color = res.statusCode >= 500 ? '\x1b[31m' : res.statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(
      `[LOGGER] ${timestamp} | ${req.method.padEnd(6)} ${req.originalUrl} -> ${color}${res.statusCode}\x1b[0m (${duration}ms)`
    );
  });

  next();
}

