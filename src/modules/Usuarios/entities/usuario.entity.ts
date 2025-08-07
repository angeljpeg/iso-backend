import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum RolUsuario {
  COORDINADOR = 'coordinador',
  MODERADOR = 'moderador',
  PROFESOR_TIEMPO_COMPLETO = 'profesor_tiempo_completo',
  PROFESOR_ASIGNATURA = 'profesor_asignatura',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.PROFESOR_ASIGNATURA,
  })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'text', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
