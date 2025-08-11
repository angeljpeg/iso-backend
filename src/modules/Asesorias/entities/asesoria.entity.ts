import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CargaAcademica } from '../../CargaAcademica/entities/carga-academica.entity';

@Entity('asesorias')
@Index(['cargaAcademicaId', 'fecha', 'temaAsesoria'], { unique: true }) // Validación: no puede haber asesoría duplicada para la misma carga académica, fecha y tema
export class Asesoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, name: 'tema_asesoria' })
  temaAsesoria: string;

  @Column({ type: 'date', name: 'fecha' })
  fecha: Date;

  @Column({ type: 'int', name: 'numero_alumnos' })
  numeroAlumnos: number;

  @Column({ type: 'varchar', length: 100, name: 'nombre_alumno' })
  nombreAlumno: string;

  @Column({ type: 'int', name: 'duracion_asesoria' }) // Duración en minutos
  duracionAsesoria: number;

  @Column({ type: 'uuid', name: 'carga_academica_id' })
  cargaAcademicaId: string;

  @Column({ default: true })
  activo: boolean;

  // Relaciones
  @ManyToOne(() => CargaAcademica, { nullable: false, eager: true })
  @JoinColumn({ name: 'carga_academica_id' })
  cargaAcademica: CargaAcademica;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
