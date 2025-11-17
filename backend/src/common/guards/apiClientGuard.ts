import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiClientGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestOrigin = request.headers['user-agent'];
    console.log('requestOrigin', requestOrigin);
    
    if (!requestOrigin.startsWith('PostmanRuntime')) {
      throw new ForbiddenException('Not allowed');
    }
    return true;
  }
}
