import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '@modules/Usuarios/usuarios.service';
import { getEnvVar } from '@utils/get-env-var';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() as (
        req: Request,
      ) => string | null,
      ignoreExpiration: false,
      secretOrKey: getEnvVar('JWT_SECRET') as string,
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuariosService.findOne(String(payload.sub));
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }
    return usuario;
  }
}
