import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SeguimientoCurso } from './seguimiento-curso.entity';

export enum EstadoAvance {
  NO_INICIADO = 'no_iniciado',
  EN_PROGRESO = 'en_progreso',
  COMPLETADO = 'completado',
  RETRASADO = 'retrasado',
}

@Index(['seguimientoCurso', 'tema'])
@Entity('seguimiento_detalle')
export class SeguimientoDetalle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'tema' })
  tema: string;

  @Column({ type: 'int', name: 'semana_terminada' })
  semanaTerminada: number;

  @Column({
    type: 'enum',
    enum: EstadoAvance,
    default: EstadoAvance.NO_INICIADO,
  })
  estadoAvance: EstadoAvance;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'text', nullable: true })
  justificacion?: string;

  @Column({ type: 'text', nullable: true })
  acciones?: string;

  @Column({ type: 'text', nullable: true })
  evidencias?: string;

  @Column({ type: 'boolean', default: false })
  retraso: boolean;

  // Relaciones
  @ManyToOne(() => SeguimientoCurso, (seguimiento) => seguimiento.detalles, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'seguimiento_curso_id' })
  seguimientoCurso: SeguimientoCurso;

  // Getter para acceder al ID del seguimiento curso
  get seguimientoCursoId(): string {
    return this.seguimientoCurso?.id;
  }
}
