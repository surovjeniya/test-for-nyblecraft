import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'src/auth/auth.service';
import { AuthService } from '../auth/auth.service';

export interface AuthRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = await this.authService.verifyJwt(token);
      req.user = user;
      next();
    } catch (e) {
      next();
    }
  }
}
