import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadiaAlumno } from './estadia-alumno.entity';

export enum Mes {
  MES_1 = 1,
  MES_2 = 2,
  MES_3 = 3,
  MES_4 = 4,
}

export enum AvanceAlumno {
  SI = 'si',
  NO = 'no',
}

@Entity('progreso_mensual')
export class ProgresoMensual {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => EstadiaAlumno,
    (estadiaAlumno) => estadiaAlumno.progresoMensual,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'estadia_alumno_id' })
  estadiaAlumno: EstadiaAlumno;

  @Column({ name: 'estadia_alumno_id' })
  estadiaAlumnoId: string;

  @Column({
    type: 'enum',
    enum: Mes,
  })
  mes: Mes;

  @Column({
    type: 'enum',
    enum: AvanceAlumno,
    nullable: true,
  })
  avance: AvanceAlumno | null;

  @Column({ type: 'text', nullable: true })
  accionesTomadas: string;

  @Column({ type: 'date', nullable: true })
  fechaEvaluacion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
