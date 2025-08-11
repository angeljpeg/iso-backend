import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tutoria } from './tutoria.entity';

export enum Vulnerabilidad {
  ACADEMICA = 'academica',
  PERSONAL = 'personal',
  SOCIOECONOMICA = 'socioeconomica',
}

export enum AreaCanalizacion {
  ASESORIA = 'Asesoria',
  MEDICO = 'Medico',
  PSICOLOGO = 'Psicologo',
  ESTUDIANTILES = 'Estudiantiles',
  ADMON = 'Admon',
  VINCULACION = 'Vinculacion',
  DIRECCION_CARRERA = 'Direccion de Carrera',
  OTRA = 'Otra',
}

export enum CausaNoAtencion {
  NO_PERSONAL = 'No había personal que atendiera en el área',
  NO_ASISTIO = 'El alumno no asistió al área canalizada',
}

export enum CausaBaja {
  SIN_CAUSA = 'Sin causa conocida',
  INCUMPLIMIENTO = 'Incumplimiento de expectativas',
  REPROBACION = 'Reprobación',
  PROBLEMAS_ECONOMICOS = 'Problemas económicos',
  MOTIVOS_PERSONALES = 'Motivos personales',
  DISTANCIA_UT = 'Distancia de la UT',
  PROBLEMAS_TRABAJO = 'Problemas de trabajo',
  CAMBIO_UT = 'Cambio de UT',
  CAMBIO_CARRERA = 'Cambio de carrera',
  FALTAS_REGLAMENTO = 'Faltas al reglamento escolar',
  OTRAS_CAUSAS = 'Otras causas',
}

@Entity('tutoria_detalles')
export class TutoriaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombreAlumno: string;

  @Column({
    type: 'enum',
    enum: Vulnerabilidad,
  })
  vulnerabilidad: Vulnerabilidad;

  @Column({
    type: 'enum',
    enum: AreaCanalizacion,
  })
  areaCanalizacion: AreaCanalizacion;

  @Column({ type: 'boolean' })
  fueAtendido: boolean;

  @Column({
    type: 'enum',
    enum: CausaNoAtencion,
    nullable: true,
  })
  causaNoAtencion: CausaNoAtencion;

  @Column({ type: 'boolean' })
  presentoMejoria: boolean;

  @Column({ type: 'boolean' })
  causoBaja: boolean;

  @Column({
    type: 'enum',
    enum: CausaBaja,
    nullable: true,
  })
  causaBaja: CausaBaja;

  @ManyToOne(() => Tutoria, (tutoria) => tutoria.detalles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutoriaId' })
  tutoria: Tutoria;

  @Column()
  tutoriaId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
