import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    if (!request.isAuthenticated()) {
      throw new UnauthorizedException(
        'You must be logged in to access this resource.',
      )
    }

    return true
  }
}
