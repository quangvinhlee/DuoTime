import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Security headers that work well with GraphQL
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()',
    );

    // Content Security Policy for GraphQL
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net http://cdn.jsdelivr.net", // Allow GraphQL playground scripts
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net http://cdn.jsdelivr.net", // Allow Google Fonts and GraphQL playground styles
        "img-src 'self' data: https: http://cdn.jsdelivr.net", // Allow GraphQL playground images
        "connect-src 'self' ws: wss:", // Allow WebSocket for GraphQL subscriptions
        "font-src 'self' data: https: https://fonts.gstatic.com", // Allow Google Fonts
        "object-src 'none'",
        "media-src 'self'",
        "frame-src 'none'",
      ].join('; '),
    );

    next();
  }
}
