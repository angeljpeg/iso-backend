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
import { Cuatrimestre } from '../../Cuatrimestres/entities/cuatrimestre.entity';
import { getCarreraByNombre } from '../../../lib/carreras';

@Entity('grupos')
@Index(['carrera', 'cuatrimestre', 'numeroGrupo'], { unique: true }) // No puede haber dos grupos con la misma carrera, cuatrimestre y número
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  carrera: string;

  @Column({ type: 'int' })
  cuatrimestre: number;

  @Column({ type: 'int', name: 'numero_grupo' })
  numeroGrupo: number;

  @Column({ name: 'nombre_generado' })
  nombreGenerado: string;

  @Column({ default: true })
  activo: boolean;

  // Relación obligatoria con Cuatrimestre
  @Column({ type: 'uuid', name: 'cuatrimestre_id' })
  cuatrimestreId: string;

  @ManyToOne(() => Cuatrimestre, (cuatrimestre) => cuatrimestre.grupos, {
    nullable: false,
    eager: true, // Siempre traer la información del cuatrimestre
  })
  @JoinColumn({ name: 'cuatrimestre_id' })
  cuatrimestreRelacion: Cuatrimestre;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para generar el nombre automáticamente usando datos estáticos
  generateNombre(): string {
    const carreraData = getCarreraByNombre(this.carrera);
    const codigo = carreraData?.codigo || 'XXX';
    return `${codigo} ${this.numeroGrupo} - ${this.cuatrimestre}`;
  }
}
