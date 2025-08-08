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
import { Usuario } from '../../Usuarios/entities/usuario.entity';
import { EstadiaAlumno } from './estadia-alumno.entity';

@Entity('estadias')
export class Estadia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'profesor_id' })
  profesor: Usuario;

  @Column({ name: 'profesor_id' })
  profesorId: string;

  @Column({ type: 'varchar', length: 100 })
  periodo: string; // Ejemplo: "2024-1", "2024-2"

  @Column({ type: 'text', nullable: true })
  observacionesGenerales: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => EstadiaAlumno, (estadiaAlumno) => estadiaAlumno.estadia, {
    cascade: true,
  })
  alumnos: EstadiaAlumno[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
