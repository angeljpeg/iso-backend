import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: any): any {
    const request = context.switchToHttp().getRequest();
    console.log('🔍 Headers recibidos:', request.headers);
    console.log('🔍 Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any): any {
    console.log('🔍 JwtAuthGuard - Error:', err);
    console.log('🔍 JwtAuthGuard - User:', user);
    console.log('🔍 JwtAuthGuard - Info:', info);
    
    if (err || !user) {
      console.log('❌ JwtAuthGuard - Authentication failed');
      throw err || new UnauthorizedException('Token inválido');
    }
    console.log('✅ JwtAuthGuard - Authentication success');
    return user;
  }
}
