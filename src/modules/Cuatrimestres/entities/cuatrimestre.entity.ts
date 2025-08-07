import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Grupo } from '../../Grupos/entities/grupo.entity';

@Entity('cuatrimestres')
@Index(['fechaInicio', 'fechaFin'], { unique: true })
export class Cuatrimestre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: Date;

  @Column({ name: 'nombre_generado' })
  nombreGenerado: string;

  @Column({ default: true })
  activo: boolean;

  // Relación One-to-Many con Grupos
  @OneToMany(() => Grupo, (grupo) => grupo.cuatrimestreRelacion)
  grupos: Grupo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para generar el nombre automáticamente
  generateNombre(): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const fechaInicioObj = new Date(this.fechaInicio);
    const fechaFinObj = new Date(this.fechaFin);

    const mesInicio = meses[fechaInicioObj.getMonth()];
    const añoInicio = fechaInicioObj.getFullYear();
    const mesFin = meses[fechaFinObj.getMonth()];
    const añoFin = fechaFinObj.getFullYear();

    return `${mesInicio} ${añoInicio} - ${mesFin} ${añoFin}`;
  }

  // Método para validar duración de 4 meses
  validateDuration(): boolean {
    const fechaInicioObj = new Date(this.fechaInicio);
    const fechaFinObj = new Date(this.fechaFin);

    // Calcular la diferencia en días
    const diffTime = fechaFinObj.getTime() - fechaInicioObj.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 4 meses aproximadamente son 120 días, con tolerancia de ±10 días
    return diffDays >= 110 && diffDays <= 130;
  }

  // Método para determinar el estado del cuatrimestre
  getEstado(): 'Próximo' | 'Activo' | 'Finalizado' {
    const hoy = new Date();
    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);

    if (hoy < fechaInicio) {
      return 'Próximo';
    } else if (hoy >= fechaInicio && hoy <= fechaFin) {
      return 'Activo';
    } else {
      return 'Finalizado';
    }
  }
}
