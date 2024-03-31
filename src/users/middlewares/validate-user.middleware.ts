import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware {
  use(req, res, next) {
    // console.log('Request...');
    
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];

    const isValidToken = this.validateToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    next();
  }

  private validateToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, 'your-secret-key');

      // Check if decoded is a string or JwtPayload
      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Invalid authorization token');
      }

      // Check if token has expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      // You can add more validation logic here if needed

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
}
