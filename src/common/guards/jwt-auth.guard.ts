/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: any): any {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido');
    }
    return user;
  }
}
