import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/middleware/auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: AuthRequest = context.switchToHttp().getRequest();
    if (request.user) {
      return true;
    } else {
      throw new UnauthorizedException({
        message: 'You dont authorized',
      });
    }
  }
}
