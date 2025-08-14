import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FormatosRevision {
  PROGRAMACION_SEGUIMIENTO_CURSO = 'programacion_seguimiento_cursos',
  REPORTE_MENSUAL_ESTADIAS = 'reporte_mensual_estadias',
  REPORTE_BIMESTRAL_TUTORIA = 'reporte_bimestral_tutoria',
  REGISTRO_ASESORIAS = 'registro_asesorias',
}

@Entity('revision')
export class Revision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  numero_revision: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'date', nullable: true })
  fecha_revision: Date;

  @Column({ type: 'date', nullable: true })
  fecha_entrega: Date;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  fecha_primera_revision: Date;

  @Column({
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_ultima_revision: Date;

  @Column({ type: 'boolean', nullable: true })
  aprobado: boolean;

  @Column({ type: 'boolean', default: false })
  @Column({ type: 'enum', enum: FormatosRevision, nullable: false })
  formato: FormatosRevision;

  @Column({ type: 'uuid' })
  formato_id: string;
}
