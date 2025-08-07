import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '@modules/Usuarios/entities/usuario.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

interface UsuarioRequest {
  rol?: string[] | string;
  // otros campos si los necesitas
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UsuarioRequest;
    console.log('Roles requeridos:', requiredRoles);
    console.log('Rol del usuario:', user.rol);

    const result = requiredRoles.some((role) =>
      Array.isArray(user.rol) ? user.rol.includes(role) : user.rol === role,
    );
    console.log('¿Usuario autorizado por rol?', result);
    return result;
  }
}
