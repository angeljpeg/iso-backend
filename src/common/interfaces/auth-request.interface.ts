import { Request } from 'express';
import { Usuario } from '@modules/Usuarios/entities/usuario.entity';

export interface AuthenticatedRequest extends Request {
  user: Usuario;
}
