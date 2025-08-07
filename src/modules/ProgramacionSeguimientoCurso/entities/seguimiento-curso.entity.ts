import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CargaAcademica } from '../../CargaAcademica/entities/carga-academica.entity';
import { Usuario } from '../../Usuarios/entities/usuario.entity';
import { SeguimientoDetalle } from './seguimiento-detalle.entity';
import { Cuatrimestre } from '../../Cuatrimestres/entities/cuatrimestre.entity';

export enum EstadoSeguimiento {
  BORRADOR = 'borrador',
  ENVIADO = 'enviado',
  REVISADO = 'revisado',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
}

@Entity('seguimiento_curso')
export class SeguimientoCurso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'carga_academica_id' })
  cargaAcademicaId: string;

  @Column({
    type: 'enum',
    enum: EstadoSeguimiento,
    default: EstadoSeguimiento.BORRADOR,
  })
  estado: EstadoSeguimiento;

  @Column({ type: 'uuid', nullable: true, name: 'revisado_por_id' })
  revisadoPorId: string;

  @Column({ type: 'timestamp', nullable: true })
  fechaEntregado: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaRevision: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaSeguimientoFinal: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  numeroRevision: number = 0;

  // Relaciones
  @ManyToOne(() => CargaAcademica, { nullable: false, eager: true })
  @JoinColumn({ name: 'carga_academica_id' })
  cargaAcademica: CargaAcademica;

  @ManyToOne(() => Cuatrimestre, { nullable: false })
  @JoinColumn({ name: 'cuatrimestre_id' })
  cuatrimestre: Cuatrimestre;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'revisado_por_id' })
  revisadoPor: Usuario;

  @OneToMany(() => SeguimientoDetalle, (detalle) => detalle.seguimientoCurso, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  detalles: SeguimientoDetalle[];
}
