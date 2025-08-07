import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../Usuarios/entities/usuario.entity';
import { SeguimientoCurso } from './seguimiento-curso.entity';

export enum TipoNotificacion {
  FALTA_ACTUALIZACION = 'falta_actualizacion',
  RETRASO_CRITICO = 'retraso_critico',
  COMENTARIO_DIRECTOR = 'comentario_director',
  RECORDATORIO = 'recordatorio',
  MANUAL = 'manual',
}

export enum EstadoNotificacion {
  PENDIENTE = 'pendiente',
  ENVIADA = 'enviada',
  LEIDA = 'leida',
  ERROR = 'error',
}

@Entity('notificacion_seguimiento')
export class NotificacionSeguimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId: string;

  @Column({ type: 'uuid', nullable: true, name: 'seguimiento_curso_id' })
  seguimientoCursoId: string;

  @Column({
    type: 'enum',
    enum: TipoNotificacion,
  })
  tipo: TipoNotificacion;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({
    type: 'enum',
    enum: EstadoNotificacion,
    default: EstadoNotificacion.PENDIENTE,
  })
  estado: EstadoNotificacion;

  @Column({ type: 'timestamp', nullable: true })
  fechaEnvio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaLectura: Date;

  @Column({ type: 'json', nullable: true })
  metadatos: any;

  // Relaciones
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => SeguimientoCurso, { nullable: true })
  @JoinColumn({ name: 'seguimiento_curso_id' })
  seguimientoCurso: SeguimientoCurso;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
