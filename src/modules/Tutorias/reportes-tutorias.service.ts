import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  Tutoria,
  EstadoProfesor,
  EstadoRevision,
} from './entities/tutoria.entity';
import {
  TutoriaDetalle,
  Vulnerabilidad,
  AreaCanalizacion,
} from './entities/tutoria-detalle.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

export interface ResumenGeneralTutorias {
  totalTutorias: number;
  totalDetalles: number;
  totalCarreras: number;
  totalProfesores: number;
  distribucionVulnerabilidad: Record<string, number>;
  distribucionAreaCanalizacion: Record<string, number>;
  distribucionEstadoProfesor: Record<string, number>;
  distribucionEstadoRevision: Record<string, number>;
}

export interface ReportePorVulnerabilidad {
  tipo: string;
  total: number;
  porcentaje: number;
  detalles: Array<{
    id: string;
    nombreAlumno: string;
    carrera: string;
    nombreTutor: string;
    fecha: Date;
    fueAtendido: boolean;
    presentoMejoria: boolean;
    causoBaja: boolean;
  }>;
}

export interface ReportePorAreaCanalizacion {
  area: string;
  total: number;
  porcentaje: number;
  detalles: Array<{
    id: string;
    nombreAlumno: string;
    carrera: string;
    nombreTutor: string;
    fecha: Date;
    fueAtendido: boolean;
    presentoMejoria: boolean;
    causoBaja: boolean;
  }>;
}

export interface ReportePorCarreraTutorias {
  carrera: string;
  totalDetalles: number;
  vulnerabilidad: Record<string, number>;
  areas: Record<string, number>;
}

export interface ReportePorProfesorTutorias {
  profesorId: string;
  nombreProfesor: string;
  totalTutorias: number;
  totalDetalles: number;
  vulnerabilidad: Record<string, number>;
  areas: Record<string, number>;
}

export interface TendenciaMensualTutorias {
  mes: string;
  totalTutorias: number;
  totalDetalles: number;
  variacionTutorias: number;
  variacionDetalles: number;
}

@Injectable()
export class ReportesTutoriasService {
  constructor(
    @InjectRepository(Tutoria)
    private readonly tutoriaRepository: Repository<Tutoria>,
    @InjectRepository(TutoriaDetalle)
    private readonly detalleRepository: Repository<TutoriaDetalle>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
  ) {}

  async getResumenGeneral(
    fechaDesde?: Date,
    fechaHasta?: Date,
    carrera?: string,
    profesorId?: string,
  ): Promise<ResumenGeneralTutorias> {
    const base = this.buildBaseDetalleQuery(
      fechaDesde,
      fechaHasta,
      carrera,
      profesorId,
    );

    const [
      totalTutorias,
      totalDetalles,
      totalCarreras,
      totalProfesores,
      distribucionVulnerabilidad,
      distribucionAreaCanalizacion,
      distribucionEstadoProfesor,
      distribucionEstadoRevision,
    ] = await Promise.all([
      this.getTotalTutorias(base),
      this.getTotalDetalles(base),
      this.getTotalCarreras(base),
      this.getTotalProfesores(base),
      this.getDistribucionVulnerabilidad(base),
      this.getDistribucionAreas(base),
      this.getDistribucionEstadoProfesor(base),
      this.getDistribucionEstadoRevision(base),
    ]);

    return {
      totalTutorias,
      totalDetalles,
      totalCarreras,
      totalProfesores,
      distribucionVulnerabilidad,
      distribucionAreaCanalizacion,
      distribucionEstadoProfesor,
      distribucionEstadoRevision,
    };
  }

  async getReportePorVulnerabilidad(
    fechaDesde?: Date,
    fechaHasta?: Date,
    carrera?: string,
  ): Promise<ReportePorVulnerabilidad[]> {
    const base = this.buildBaseDetalleQuery(fechaDesde, fechaHasta, carrera);
    const tipos = Object.values(Vulnerabilidad);
    const totalGeneral = await this.getTotalDetalles(base);

    const reportes = await Promise.all(
      tipos.map(async (tipo) => {
        const total = await this.getTotalPorVulnerabilidad(base, tipo);
        const porcentaje = totalGeneral > 0 ? (total / totalGeneral) * 100 : 0;
        const detalles = await this.getDetallesPorVulnerabilidad(base, tipo);
        return {
          tipo,
          total,
          porcentaje: Math.round(porcentaje * 100) / 100,
          detalles,
        };
      }),
    );

    return reportes.filter((r) => r.total > 0);
  }

  async getReportePorArea(
    fechaDesde?: Date,
    fechaHasta?: Date,
    carrera?: string,
  ): Promise<ReportePorAreaCanalizacion[]> {
    const base = this.buildBaseDetalleQuery(fechaDesde, fechaHasta, carrera);
    const areas = Object.values(AreaCanalizacion);
    const totalGeneral = await this.getTotalDetalles(base);

    const reportes = await Promise.all(
      areas.map(async (area) => {
        const total = await this.getTotalPorArea(base, area);
        const porcentaje = totalGeneral > 0 ? (total / totalGeneral) * 100 : 0;
        const detalles = await this.getDetallesPorArea(base, area);
        return {
          area,
          total,
          porcentaje: Math.round(porcentaje * 100) / 100,
          detalles,
        };
      }),
    );

    return reportes.filter((r) => r.total > 0);
  }

  async getReportePorCarrera(
    fechaDesde?: Date,
    fechaHasta?: Date,
  ): Promise<ReportePorCarreraTutorias[]> {
    const base = this.buildBaseDetalleQuery(fechaDesde, fechaHasta);

    const carrerasRaw = await base
      .clone()
      .select('t.carrera', 'carrera')
      .addSelect('COUNT(td.id)', 'total')
      .groupBy('t.carrera')
      .orderBy('total', 'DESC')
      .getRawMany<{ carrera: string; total: string }>();

    const reportes = await Promise.all(
      carrerasRaw.map(async (row) => {
        const carrera = row.carrera;
        const carreraQuery = base
          .clone()
          .andWhere('t.carrera = :carrera', { carrera });
        const [totalDetalles, vulnerabilidad, areas] = await Promise.all([
          this.getTotalDetalles(carreraQuery),
          this.getDistribucionVulnerabilidad(carreraQuery),
          this.getDistribucionAreas(carreraQuery),
        ]);
        return {
          carrera,
          totalDetalles,
          vulnerabilidad,
          areas,
        };
      }),
    );

    return reportes;
  }

  async getReportePorProfesor(
    fechaDesde?: Date,
    fechaHasta?: Date,
    profesorId?: string,
  ): Promise<ReportePorProfesorTutorias[]> {
    const base = this.buildBaseDetalleQuery(fechaDesde, fechaHasta);

    if (profesorId) {
      base.andWhere('ca.profesorId = :profesorId', { profesorId });
    }

    const profesores = await this.cargaAcademicaRepository
      .createQueryBuilder('ca')
      .leftJoin('ca.profesor', 'profesor')
      .leftJoin(Tutoria, 't', 't.cargaAcademicaId = ca.id')
      .leftJoin(TutoriaDetalle, 'td', 'td.tutoriaId = t.id')
      .select('profesor.id', 'profesorId')
      .addSelect('profesor.nombre', 'nombreProfesor')
      .addSelect('COUNT(DISTINCT t.id)', 'totalTutorias')
      .addSelect('COUNT(td.id)', 'totalDetalles')
      .groupBy('profesor.id')
      .addGroupBy('profesor.nombre')
      .orderBy('COUNT(td.id)', 'DESC')
      .getRawMany<{
        profesorId: string;
        nombreProfesor: string;
        totalTutorias: string;
        totalDetalles: string;
      }>();

    const reportes = await Promise.all(
      profesores.map(async (row) => {
        const q = base.clone().andWhere('ca.profesorId = :profesorId', {
          profesorId: row.profesorId,
        });
        const [vulnerabilidad, areas] = await Promise.all([
          this.getDistribucionVulnerabilidad(q),
          this.getDistribucionAreas(q),
        ]);
        return {
          profesorId: row.profesorId,
          nombreProfesor: row.nombreProfesor,
          totalTutorias: parseInt(row.totalTutorias || '0') || 0,
          totalDetalles: parseInt(row.totalDetalles || '0') || 0,
          vulnerabilidad,
          areas,
        };
      }),
    );

    return reportes;
  }

  async getTendenciasMensuales(
    anio: number,
    carrera?: string,
  ): Promise<TendenciaMensualTutorias[]> {
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

    const baseDetalle = this.detalleRepository
      .createQueryBuilder('td')
      .leftJoin('td.tutoria', 't')
      .where('EXTRACT(YEAR FROM t.fecha) = :anio', { anio });

    if (carrera) {
      baseDetalle.andWhere('t.carrera = :carrera', { carrera });
    }

    const baseTutoria = this.tutoriaRepository
      .createQueryBuilder('t')
      .where('EXTRACT(YEAR FROM t.fecha) = :anio', { anio });

    if (carrera) {
      baseTutoria.andWhere('t.carrera = :carrera', { carrera });
    }

    const tendencias = await Promise.all(
      meses.map(async (mes, index) => {
        const mesNumero = index + 1;
        const totalDetalles = await baseDetalle
          .clone()
          .andWhere('EXTRACT(MONTH FROM t.fecha) = :mes', { mes: mesNumero })
          .getCount();

        const totalTutorias = await baseTutoria
          .clone()
          .andWhere('EXTRACT(MONTH FROM t.fecha) = :mes', { mes: mesNumero })
          .getCount();

        const detallesMesAnterior = await baseDetalle
          .clone()
          .andWhere('EXTRACT(MONTH FROM t.fecha) = :mes', {
            mes: mesNumero === 1 ? 12 : mesNumero - 1,
          })
          .getCount();

        const tutoriasMesAnterior = await baseTutoria
          .clone()
          .andWhere('EXTRACT(MONTH FROM t.fecha) = :mes', {
            mes: mesNumero === 1 ? 12 : mesNumero - 1,
          })
          .getCount();

        const variacionDetalles =
          detallesMesAnterior > 0
            ? ((totalDetalles - detallesMesAnterior) / detallesMesAnterior) *
              100
            : 0;
        const variacionTutorias =
          tutoriasMesAnterior > 0
            ? ((totalTutorias - tutoriasMesAnterior) / tutoriasMesAnterior) *
              100
            : 0;

        return {
          mes,
          totalTutorias,
          totalDetalles,
          variacionTutorias: Math.round(variacionTutorias * 100) / 100,
          variacionDetalles: Math.round(variacionDetalles * 100) / 100,
        } as TendenciaMensualTutorias;
      }),
    );

    return tendencias;
  }

  async exportarExcel(
    fechaDesde?: Date,
    fechaHasta?: Date,
    carrera?: string,
    profesorId?: string,
  ): Promise<any> {
    const datos = await this.getResumenGeneral(
      fechaDesde,
      fechaHasta,
      carrera,
      profesorId,
    );
    return {
      mensaje: 'Datos preparados para exportación',
      datos,
      formato: 'excel',
      timestamp: new Date().toISOString(),
    };
  }

  // Base query sobre detalles con joins a tutoria y carga académica
  private buildBaseDetalleQuery(
    fechaDesde?: Date,
    fechaHasta?: Date,
    carrera?: string,
    profesorId?: string,
  ): SelectQueryBuilder<TutoriaDetalle> {
    const qb = this.detalleRepository
      .createQueryBuilder('td')
      .leftJoin('td.tutoria', 't')
      .leftJoin('t.cargaAcademica', 'ca');

    if (fechaDesde) qb.andWhere('t.fecha >= :fechaDesde', { fechaDesde });
    if (fechaHasta) qb.andWhere('t.fecha <= :fechaHasta', { fechaHasta });
    if (carrera) qb.andWhere('t.carrera = :carrera', { carrera });
    if (profesorId) qb.andWhere('ca.profesorId = :profesorId', { profesorId });

    return qb;
  }

  // Métricas
  private async getTotalTutorias(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<number> {
    return await qb
      .clone()
      .select('COUNT(DISTINCT t.id)', 'total')
      .getRawOne<{ total: string }>()
      .then((r) => parseInt(r?.total || '0') || 0);
  }

  private async getTotalDetalles(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<number> {
    return await qb
      .clone()
      .select('COUNT(td.id)', 'total')
      .getRawOne<{ total: string }>()
      .then((r) => parseInt(r?.total || '0') || 0);
  }

  private async getTotalCarreras(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<number> {
    return await qb
      .clone()
      .select('COUNT(DISTINCT t.carrera)', 'total')
      .getRawOne<{ total: string }>()
      .then((r) => parseInt(r?.total || '0') || 0);
  }

  private async getTotalProfesores(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<number> {
    return await qb
      .clone()
      .select('COUNT(DISTINCT ca.profesorId)', 'total')
      .getRawOne<{ total: string }>()
      .then((r) => parseInt(r?.total || '0') || 0);
  }

  private async getDistribucionVulnerabilidad(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<Record<string, number>> {
    const tipos = Object.values(Vulnerabilidad);
    const resultados = await Promise.all(
      tipos.map(async (tipo) => ({
        tipo,
        total: await this.getTotalPorVulnerabilidad(qb, tipo),
      })),
    );
    return resultados.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.tipo] = cur.total;
      return acc;
    }, {});
  }

  private async getDistribucionAreas(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<Record<string, number>> {
    const areas = Object.values(AreaCanalizacion);
    const resultados = await Promise.all(
      areas.map(async (area) => ({
        area,
        total: await this.getTotalPorArea(qb, area),
      })),
    );
    return resultados.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.area] = cur.total;
      return acc;
    }, {});
  }

  private async getDistribucionEstadoProfesor(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<Record<string, number>> {
    const estados = Object.values(EstadoProfesor);
    const resultados = await Promise.all(
      estados.map(async (estado) => ({
        estado,
        total: await qb
          .clone()
          .andWhere('t.estado = :estado', { estado })
          .getCount(),
      })),
    );
    return resultados.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.estado] = cur.total;
      return acc;
    }, {});
  }

  private async getDistribucionEstadoRevision(
    qb: SelectQueryBuilder<TutoriaDetalle>,
  ): Promise<Record<string, number>> {
    const estados = Object.values(EstadoRevision);
    const resultados = await Promise.all(
      estados.map(async (estado) => ({
        estado,
        total: await qb
          .clone()
          .andWhere('t.estadoRevision = :estado', { estado })
          .getCount(),
      })),
    );
    return resultados.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.estado] = cur.total;
      return acc;
    }, {});
  }

  // Totales por categoría
  private async getTotalPorVulnerabilidad(
    qb: SelectQueryBuilder<TutoriaDetalle>,
    tipo: string,
  ): Promise<number> {
    return await qb
      .clone()
      .andWhere('td.vulnerabilidad = :tipo', { tipo })
      .getCount();
  }

  private async getTotalPorArea(
    qb: SelectQueryBuilder<TutoriaDetalle>,
    area: string,
  ): Promise<number> {
    return await qb
      .clone()
      .andWhere('td.areaCanalizacion = :area', { area })
      .getCount();
  }

  // Listados detalle
  private async getDetallesPorVulnerabilidad(
    qb: SelectQueryBuilder<TutoriaDetalle>,
    tipo: string,
  ): Promise<
    Array<{
      id: string;
      nombreAlumno: string;
      carrera: string;
      nombreTutor: string;
      fecha: Date;
      fueAtendido: boolean;
      presentoMejoria: boolean;
      causoBaja: boolean;
    }>
  > {
    const rows = await qb
      .clone()
      .andWhere('td.vulnerabilidad = :tipo', { tipo })
      .select([
        'td.id as id',
        'td.nombreAlumno as nombreAlumno',
        't.carrera as carrera',
        't.nombreTutor as nombreTutor',
        't.fecha as fecha',
        'td.fueAtendido as fueAtendido',
        'td.presentoMejoria as presentoMejoria',
        'td.causoBaja as causoBaja',
      ])
      .getRawMany();
    return rows as Array<{
      id: string;
      nombreAlumno: string;
      carrera: string;
      nombreTutor: string;
      fecha: Date;
      fueAtendido: boolean;
      presentoMejoria: boolean;
      causoBaja: boolean;
    }>;
  }

  private async getDetallesPorArea(
    qb: SelectQueryBuilder<TutoriaDetalle>,
    area: string,
  ): Promise<
    Array<{
      id: string;
      nombreAlumno: string;
      carrera: string;
      nombreTutor: string;
      fecha: Date;
      fueAtendido: boolean;
      presentoMejoria: boolean;
      causoBaja: boolean;
    }>
  > {
    const rows = await qb
      .clone()
      .andWhere('td.areaCanalizacion = :area', { area })
      .select([
        'td.id as id',
        'td.nombreAlumno as nombreAlumno',
        't.carrera as carrera',
        't.nombreTutor as nombreTutor',
        't.fecha as fecha',
        'td.fueAtendido as fueAtendido',
        'td.presentoMejoria as presentoMejoria',
        'td.causoBaja as causoBaja',
      ])
      .getRawMany();
    return rows as Array<{
      id: string;
      nombreAlumno: string;
      carrera: string;
      nombreTutor: string;
      fecha: Date;
      fueAtendido: boolean;
      presentoMejoria: boolean;
      causoBaja: boolean;
    }>;
  }
}
