import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CargaAcademica } from '../../CargaAcademica/entities/carga-academica.entity';

export enum TipoNecesidad {
  CONDUCTUAL = 'conductual',
  COMUNICACIONAL = 'comunicacional',
  INTELECTUAL = 'intelectual',
  FISICA = 'fisica',
  SUPERDOTACION = 'superdotacion',
  OTRA = 'otra',
}

@Entity('necesidades_especiales')
export class NecesidadesEspeciales {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 255 })
  nombreAlumno: string;

  @Column({ length: 50 })
  numeroMatricula: string;

  @Column({ length: 255 })
  programaEducativo: string;

  @Column({ type: 'date' })
  fechaRevision: Date;

  @Column()
  numeroRevision: number;

  // Excepciones conductuales
  @Column({ type: 'boolean', default: false })
  excepcionesConductuales: boolean;

  @Column({ type: 'text', nullable: true })
  especificacionConductual: string;

  // Excepciones comunicacionales
  @Column({ type: 'boolean', default: false })
  excepcionesComunicacionales: boolean;

  @Column({ type: 'text', nullable: true })
  especificacionComunicacional: string;

  // Excepciones intelectuales
  @Column({ type: 'boolean', default: false })
  excepcionesIntelectuales: boolean;

  @Column({ type: 'text', nullable: true })
  especificacionIntelectual: string;

  // Excepciones físicas
  @Column({ type: 'boolean', default: false })
  excepcionesFisicas: boolean;

  @Column({ type: 'text', nullable: true })
  especificacionFisica: string;

  // Excepciones de superdotación
  @Column({ type: 'boolean', default: false })
  excepcionesSuperdotacion: boolean;

  @Column({ type: 'text', nullable: true })
  especificacionSuperdotacion: string;

  // Otras necesidades especiales
  @Column({ type: 'text', nullable: true })
  otrasNecesidades: string;

  // Relación con carga académica
  @ManyToOne(() => CargaAcademica, { nullable: false })
  @JoinColumn({ name: 'carga_academica_id' })
  cargaAcademica: CargaAcademica;

  @Column()
  cargaAcademicaId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
