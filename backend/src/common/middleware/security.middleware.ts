import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()',
    );

    // Relaxed CSP for development - tighten in production
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self' *", // Allow all origins for development
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net http://cdn.jsdelivr.net *",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net http://cdn.jsdelivr.net *",
        "img-src 'self' data: https: http: *",
        "connect-src 'self' ws: wss: http: https: *", // Allow all connections for development
        "font-src 'self' data: https: https://fonts.gstatic.com *",
        "object-src 'none'",
        "media-src 'self' *",
        "frame-src 'none'",
      ].join('; '),
    );

    next();
  }
}
