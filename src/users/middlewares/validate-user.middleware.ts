import { Injectable, UnauthorizedException } from '@nestjs/common';

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
    //can use logic to validate the logic too
    return true; // For demonstration purposes, always returning true
  }
}
