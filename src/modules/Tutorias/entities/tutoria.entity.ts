import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CargaAcademica } from '../../CargaAcademica/entities/carga-academica.entity';
import { TutoriaDetalle } from './tutoria-detalle.entity';

export enum EstadoProfesor {
  EN_PROGRESO = 'en progreso',
  COMPLETADO = 'completado',
}

export enum EstadoRevision {
  SIN_REVISAR = 'sin revisar',
  REVISADO = 'revisado',
  REVISANDO = 'revisando',
  ACEPTADO = 'aceptado',
  RECHAZADO = 'rechazado',
}

@Entity('tutorias')
export class Tutoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  cuatrimestre: string;

  @Column({ type: 'varchar', length: 100 })
  nombreTutor: string;

  @Column({ type: 'varchar', length: 100 })
  grupo: string;

  @Column({ type: 'varchar', length: 100 })
  carrera: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'date', nullable: true })
  fechaRevision: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column('simple-array', { nullable: true })
  actividadesTutoriaGrupal: string[];

  @Column({
    type: 'enum',
    enum: EstadoProfesor,
    default: EstadoProfesor.EN_PROGRESO,
  })
  estado: EstadoProfesor;

  @Column({
    type: 'enum',
    enum: EstadoRevision,
    default: EstadoRevision.SIN_REVISAR,
  })
  estadoRevision: EstadoRevision;

  @ManyToOne(() => CargaAcademica, { nullable: false })
  @JoinColumn({ name: 'cargaAcademicaId' })
  cargaAcademica: CargaAcademica;

  @Column()
  cargaAcademicaId: number;

  @OneToMany(() => TutoriaDetalle, (detalle) => detalle.tutoria, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  detalles: TutoriaDetalle[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
