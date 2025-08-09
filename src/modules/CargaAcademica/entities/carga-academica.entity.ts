import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../Usuarios/entities/usuario.entity';
import { Grupo } from '../../Grupos/entities/grupo.entity';

@Entity('carga_academica')
@Index(['profesorId', 'grupoId', 'carrera', 'asignatura'], { unique: true }) // Validación: no puede haber asignación duplicada
@Index(['grupoId', 'carrera', 'asignatura'], { unique: true }) // Validación: no puede haber más de un profesor por asignatura-grupo
export class CargaAcademica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'profesor_id' })
  profesorId: string;

  @Column({ type: 'varchar', length: 100 })
  carrera: string;

  @Column({ type: 'varchar', length: 100 })
  asignatura: string;

  @Column({ type: 'uuid', name: 'grupo_id' })
  grupoId: string;

  @Column({ type: 'uuid', name: 'cuatrimestre_id' })
  cuatrimestreId: string;

  @Column({ default: true })
  activo: boolean;

  // Relaciones
  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'profesor_id' })
  profesor: Usuario;

  @ManyToOne(() => Grupo, { nullable: false })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
