import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UTF8Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const contentType = req.headers['content-type'];
    if (contentType === 'application/json') {
      try {
        const body: Record<string, string> = req.body;
        for (const prop in body) {
          if (Object.prototype.hasOwnProperty.call(body, prop)) {
            const isUtf8 =
              /^[\u0020-\uD7FF\u0009\u000A\u000D\uE000-\uFFFD]*$/.test(
                body[prop],
              );
            if (!isUtf8) {
              throw new Error(`Invalid UTF-8 code found in property '${prop}'`);
            }
          }
        }
        next();
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    } else {
      next();
    }
  }
}
