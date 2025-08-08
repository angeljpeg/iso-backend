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
import { Estadia } from './estadia.entity';
import { ProgresoMensual } from './progreso-mensual.entity';

@Entity('estadia_alumnos')
export class EstadiaAlumno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombreAlumno: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  matricula: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrera: string;

  @ManyToOne(() => Estadia, (estadia) => estadia.alumnos, { nullable: false })
  @JoinColumn({ name: 'estadia_id' })
  estadia: Estadia;

  @Column({ name: 'estadia_id' })
  estadiaId: string;

  @Column({ type: 'text', nullable: true })
  observacionesGenerales: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ProgresoMensual, (progreso) => progreso.estadiaAlumno, {
    cascade: true,
  })
  progresoMensual: ProgresoMensual[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
