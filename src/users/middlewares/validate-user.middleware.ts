import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware {
  use(req, res, next) {
    console.log('Request...');
    
    // Check if authorization header is present
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    // Check if token is valid (You need to implement this part)
    const isValidToken = this.validateToken(token);
    if (!isValidToken) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    next();
  }

  private validateToken(token: string): boolean {
    // You need to implement the logic to validate the token here
    // For example, you can use JWT verification or any other method
    // Return true if token is valid, false otherwise
    // Example JWT validation:
    // try {
    //   jwt.verify(token, 'your_secret_key');
    //   return true;
    // } catch (error) {
    //   return false;
    // }
    return true; // For demonstration purposes, always returning true
  }
}
