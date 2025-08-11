// Exportaciones principales del módulo
export * from './programacion-seguimiento-curso.module';
export * from './programacion-seguimiento-curso.service';
export * from './programacion-seguimiento-curso.controller';

// Exportaciones del sistema de reportes
export * from './reportes-seguimiento.service';
export * from './reportes-seguimiento.controller';

// Exportaciones de DTOs
export * from './dto/create-seguimiento-curso.dto';
export * from './dto/update-seguimiento-curso.dto';
export * from './dto/create-seguimiento-detalle.dto';
export * from './dto/update-seguimiento-detalle.dto';
export * from './dto/create-notificacion.dto';
export * from './dto/reportes.dto';

// Exportaciones de entidades
export * from './entities/seguimiento-curso.entity';
export * from './entities/seguimiento-detalle.entity';
export * from './entities/notificacion-seguimiento.entity';

// Exportaciones de enums
export { EstadoSeguimiento } from './entities/seguimiento-curso.entity';
export { EstadoAvance } from './entities/seguimiento-detalle.entity';
export {
  TipoNotificacion,
  EstadoNotificacion,
} from './entities/notificacion-seguimiento.entity';
