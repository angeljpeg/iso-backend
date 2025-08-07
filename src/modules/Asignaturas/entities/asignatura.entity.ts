import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Tema } from '../../Temas/entities/tema.entity';

@Entity('asignaturas')
@Index(['nombre', 'carrera'], { unique: true }) // Validación: no puede haber dos asignaturas con el mismo nombre en la misma carrera
export class Asignatura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  carrera: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Tema, (tema) => tema.asignatura)
  temas: Tema[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
