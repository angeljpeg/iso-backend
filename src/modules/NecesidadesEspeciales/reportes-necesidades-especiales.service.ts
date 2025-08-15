import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NecesidadesEspeciales } from './entities/necesidades-especiales.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

export interface ResumenGeneral {
  totalRegistros: number;
  totalAlumnos: number;
  totalCarreras: number;
  totalProfesores: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  distribucionPorCarrera: Array<{
    carrera: string;
    total: number;
    porcentaje: number;
  }>;
  distribucionPorMes: Array<{
    mes: string;
    total: number;
  }>;
}

export interface ReportePorTipoNecesidad {
  tipo: string;
  total: number;
  porcentaje: number;
  detalles: Array<{
    id: number;
    nombreAlumno: string;
    numeroMatricula: string;
    programaEducativo: string;
    especificacion: string;
    fecha: Date;
  }>;
}

export interface ReportePorCarrera {
  carrera: string;
  total: number;
  porcentaje: number;
  tiposNecesidad: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  alumnos: Array<{
    id: number;
    nombre: string;
    matricula: string;
    tiposNecesidad: string[];
  }>;
}

export interface ReportePorProfesor {
  profesorId: string;
  nombreProfesor: string;
  totalAlumnos: number;
  totalNecesidades: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
  alumnos: Array<{
    id: number;
    nombre: string;
    matricula: string;
    programaEducativo: string;
    tiposNecesidad: string[];
  }>;
}

export interface TendenciaMensual {
  mes: string;
  total: number;
  variacion: number;
  distribucionPorTipo: {
    conductuales: number;
    comunicacionales: number;
    intelectuales: number;
    fisicas: number;
    superdotacion: number;
    otras: number;
  };
}

// Interfaces para resultados de consultas raw
interface CarreraRawResult {
  carrera: string;
  total: string;
}

interface ProfesorRawResult {
  profesorId: string;
  nombreProfesor: string;
  totalNecesidades: string;
  totalAlumnos: string;
}

interface CountRawResult {
  total: string;
}

@Injectable()
export class ReportesNecesidadesEspecialesService {
  constructor(
    @InjectRepository(NecesidadesEspeciales)
    private readonly necesidadesEspecialesRepository: Repository<NecesidadesEspeciales>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
  ) {}

  async getResumenGeneral(
    fechaDesde?: Date,
    fechaHasta?: Date,
    programaEducativo?: string,
  ): Promise<ResumenGeneral> {
    const queryBuilder = this.buildBaseQuery(
      fechaDesde,
      fechaHasta,
      programaEducativo,
    );

    const [
      totalRegistros,
      totalAlumnos,
      totalCarreras,
      totalProfesores,
      distribucionPorTipo,
      distribucionPorCarrera,
      distribucionPorMes,
    ] = await Promise.all([
      this.getTotalRegistros(queryBuilder),
      this.getTotalAlumnos(queryBuilder),
      this.getTotalCarreras(queryBuilder),
      this.getTotalProfesores(queryBuilder),
      this.getDistribucionPorTipo(queryBuilder),
      this.getDistribucionPorCarrera(queryBuilder),
      this.getDistribucionPorMes(queryBuilder),
    ]);

    return {
      totalRegistros,
      totalAlumnos,
      totalCarreras,
      totalProfesores,
      distribucionPorTipo,
      distribucionPorCarrera,
      distribucionPorMes,
    };
  }

  async getReportePorTipoNecesidad(
    fechaDesde?: Date,
    fechaHasta?: Date,
    programaEducativo?: string,
  ): Promise<ReportePorTipoNecesidad[]> {
    const queryBuilder = this.buildBaseQuery(
      fechaDesde,
      fechaHasta,
      programaEducativo,
    );

    const tipos = [
      { nombre: 'Conductuales', campo: 'excepcionesConductuales' },
      { nombre: 'Comunicacionales', campo: 'excepcionesComunicacionales' },
      { nombre: 'Intelectuales', campo: 'excepcionesIntelectuales' },
      { nombre: 'Físicas', campo: 'excepcionesFisicas' },
      { nombre: 'Superdotación', campo: 'excepcionesSuperdotacion' },
      { nombre: 'Otras', campo: 'otrasNecesidades' },
    ];

    const reportes = await Promise.all(
      tipos.map(async (tipo) => {
        const total = await this.getTotalPorTipo(queryBuilder, tipo.campo);
        const detalles = await this.getDetallesPorTipo(
          queryBuilder,
          tipo.campo,
        );
        const porcentaje =
          total > 0
            ? (total / (await this.getTotalRegistros(queryBuilder))) * 100
            : 0;

        return {
          tipo: tipo.nombre,
          total,
          porcentaje: Math.round(porcentaje * 100) / 100,
          detalles,
        };
      }),
    );

    return reportes.filter((reporte) => reporte.total > 0);
  }

  async getReportePorCarrera(
    fechaDesde?: Date,
    fechaHasta?: Date,
  ): Promise<ReportePorCarrera[]> {
    const queryBuilder = this.buildBaseQuery(fechaDesde, fechaHasta);

    const carreras = await this.necesidadesEspecialesRepository
      .createQueryBuilder('ne')
      .select('ne.programaEducativo', 'carrera')
      .addSelect('COUNT(*)', 'total')
      .where('ne.isDeleted = :isDeleted', { isDeleted: false })
      .groupBy('ne.programaEducativo')
      .orderBy('total', 'DESC')
      .getRawMany<CarreraRawResult>();

    const totalGeneral = await this.getTotalRegistros(queryBuilder);

    const reportes = await Promise.all(
      carreras.map(async (carrera) => {
        const tiposNecesidad = await this.getTiposNecesidadPorCarrera(
          carrera.carrera,
          queryBuilder,
        );
        const alumnos = await this.getAlumnosPorCarrera(
          carrera.carrera,
          queryBuilder,
        );
        const porcentaje = (parseInt(carrera.total) / totalGeneral) * 100;

        return {
          carrera: carrera.carrera,
          total: parseInt(carrera.total),
          porcentaje: Math.round(porcentaje * 100) / 100,
          tiposNecesidad,
          alumnos,
        };
      }),
    );

    return reportes;
  }

  async getReportePorProfesor(
    fechaDesde?: Date,
    fechaHasta?: Date,
    profesorId?: string,
  ): Promise<ReportePorProfesor[]> {
    const queryBuilder = this.buildBaseQuery(
      fechaDesde,
      fechaHasta,
    ).leftJoinAndSelect('ca.profesor', 'profesor');

    if (profesorId) {
      queryBuilder.andWhere('ca.profesorId = :profesorId', { profesorId });
    }

    const profesores = await this.cargaAcademicaRepository
      .createQueryBuilder('ca')
      .leftJoin('ca.profesor', 'profesor')
      .leftJoin(NecesidadesEspeciales, 'ne', 'ne.carga_academica_id = ca.id')
      .select('profesor.id', 'profesorId')
      .addSelect('profesor.nombre', 'nombreProfesor')
      .addSelect('COUNT(DISTINCT ne.id)', 'totalNecesidades')
      .addSelect('COUNT(DISTINCT ca.id)', 'totalAlumnos')
      .where('ne.isDeleted = :isDeleted', { isDeleted: false })
      .groupBy('profesor.id')
      .addGroupBy('profesor.nombre')
      .orderBy('totalNecesidades', 'DESC')
      .getRawMany<ProfesorRawResult>();

    const reportes = await Promise.all(
      profesores.map(async (profesor) => {
        const distribucionPorTipo =
          await this.getDistribucionPorTipoPorProfesor(
            profesor.profesorId,
            queryBuilder,
          );
        const alumnos = await this.getAlumnosPorProfesor(
          profesor.profesorId,
          queryBuilder,
        );

        return {
          profesorId: profesor.profesorId,
          nombreProfesor: profesor.nombreProfesor,
          totalAlumnos: parseInt(profesor.totalAlumnos),
          totalNecesidades: parseInt(profesor.totalNecesidades),
          distribucionPorTipo,
          alumnos,
        };
      }),
    );

    return reportes;
  }

  async getTendenciasMensuales(
    anio: number,
    programaEducativo?: string,
  ): Promise<TendenciaMensual[]> {
    const queryBuilder = this.necesidadesEspecialesRepository
      .createQueryBuilder('ne')
      .leftJoinAndSelect('ne.cargaAcademica', 'ca')
      .where('ne.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('EXTRACT(YEAR FROM ne.fecha) = :anio', { anio });

    if (programaEducativo) {
      queryBuilder.andWhere('ne.programaEducativo = :programaEducativo', {
        programaEducativo,
      });
    }

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

    const tendencias = await Promise.all(
      meses.map(async (mes, index) => {
        const mesNumero = index + 1;
        const total = await queryBuilder
          .clone()
          .andWhere('EXTRACT(MONTH FROM ne.fecha) = :mes', { mes: mesNumero })
          .getCount();

        const distribucionPorTipo = await this.getDistribucionPorTipoPorMes(
          queryBuilder,
          mesNumero,
        );

        // Calcular variación con el mes anterior
        const mesAnterior = mesNumero === 1 ? 12 : mesNumero - 1;
        const totalMesAnterior = await queryBuilder
          .clone()
          .andWhere('EXTRACT(MONTH FROM ne.fecha) = :mes', { mes: mesAnterior })
          .getCount();

        const variacion =
          totalMesAnterior > 0
            ? ((total - totalMesAnterior) / totalMesAnterior) * 100
            : 0;

        return {
          mes,
          total,
          variacion: Math.round(variacion * 100) / 100,
          distribucionPorTipo,
        };
      }),
    );

    return tendencias;
  }

  async exportarExcel(
    fechaDesde?: Date,
    fechaHasta?: Date,
    programaEducativo?: string,
  ): Promise<any> {
    // Implementar exportación a Excel
    // Por ahora retornamos los datos para que el frontend los procese
    const datos = await this.getResumenGeneral(
      fechaDesde,
      fechaHasta,
      programaEducativo,
    );
    return {
      mensaje: 'Datos preparados para exportación',
      datos,
      formato: 'excel',
      timestamp: new Date().toISOString(),
    };
  }

  // Métodos auxiliares privados
  private buildBaseQuery(
    fechaDesde?: Date,
    fechaHasta?: Date,
    programaEducativo?: string,
  ): SelectQueryBuilder<NecesidadesEspeciales> {
    const queryBuilder = this.necesidadesEspecialesRepository
      .createQueryBuilder('ne')
      .leftJoinAndSelect('ne.cargaAcademica', 'ca')
      .where('ne.isDeleted = :isDeleted', { isDeleted: false });

    if (fechaDesde) {
      queryBuilder.andWhere('ne.fecha >= :fechaDesde', { fechaDesde });
    }

    if (fechaHasta) {
      queryBuilder.andWhere('ne.fecha <= :fechaHasta', { fechaHasta });
    }

    if (programaEducativo) {
      queryBuilder.andWhere('ne.programaEducativo = :programaEducativo', {
        programaEducativo,
      });
    }

    return queryBuilder;
  }

  private async getTotalRegistros(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<number> {
    return await queryBuilder.getCount();
  }

  private async getTotalAlumnos(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<number> {
    return await queryBuilder
      .select('COUNT(DISTINCT ne.numeroMatricula)', 'total')
      .getRawOne<CountRawResult>()
      .then((result) => parseInt(result?.total || '0') || 0);
  }

  private async getTotalCarreras(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<number> {
    return await queryBuilder
      .select('COUNT(DISTINCT ne.programaEducativo)', 'total')
      .getRawOne<CountRawResult>()
      .then((result) => parseInt(result?.total || '0') || 0);
  }

  private async getTotalProfesores(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<number> {
    return await queryBuilder
      .leftJoin('ca.profesor', 'profesor')
      .select('COUNT(DISTINCT profesor.id)', 'total')
      .getRawOne<CountRawResult>()
      .then((result) => parseInt(result?.total || '0') || 0);
  }

  private async getDistribucionPorTipo(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any> {
    const [
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    ] = await Promise.all([
      this.getTotalPorTipo(queryBuilder, 'excepcionesConductuales'),
      this.getTotalPorTipo(queryBuilder, 'excepcionesComunicacionales'),
      this.getTotalPorTipo(queryBuilder, 'excepcionesIntelectuales'),
      this.getTotalPorTipo(queryBuilder, 'excepcionesFisicas'),
      this.getTotalPorTipo(queryBuilder, 'excepcionesSuperdotacion'),
      this.getTotalPorTipo(queryBuilder, 'otrasNecesidades'),
    ]);

    return {
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    };
  }

  private async getTotalPorTipo(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
    campo: string,
  ): Promise<number> {
    const qb = queryBuilder.clone();
    if (campo === 'otrasNecesidades') {
      qb.andWhere(
        "ne.otrasNecesidades IS NOT NULL AND ne.otrasNecesidades <> ''",
      );
      return await qb.getCount();
    }
    return await qb
      .andWhere(`ne.${campo} = :valor`, { valor: true })
      .getCount();
  }

  private async getDetallesPorTipo(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
    campo: string,
  ): Promise<any[]> {
    const qb = queryBuilder.clone();
    const especificacionCampo = this.mapCampoToEspecificacion(campo);
    if (campo === 'otrasNecesidades') {
      qb.andWhere(
        "ne.otrasNecesidades IS NOT NULL AND ne.otrasNecesidades <> ''",
      );
    } else {
      qb.andWhere(`ne.${campo} = :valor`, { valor: true });
    }

    const resultados = await qb
      .select([
        'ne.id as id',
        'ne.nombreAlumno as nombreAlumno',
        'ne.numeroMatricula as numeroMatricula',
        'ne.programaEducativo as programaEducativo',
        `${especificacionCampo} as especificacion`,
        'ne.fecha as fecha',
      ])
      .getRawMany();

    return resultados;
  }

  private mapCampoToEspecificacion(campo: string): string {
    switch (campo) {
      case 'excepcionesConductuales':
        return 'ne.especificacionConductual';
      case 'excepcionesComunicacionales':
        return 'ne.especificacionComunicacional';
      case 'excepcionesIntelectuales':
        return 'ne.especificacionIntelectual';
      case 'excepcionesFisicas':
        return 'ne.especificacionFisica';
      case 'excepcionesSuperdotacion':
        return 'ne.especificacionSuperdotacion';
      case 'otrasNecesidades':
        return 'ne.otrasNecesidades';
      default:
        return 'ne.otrasNecesidades';
    }
  }

  private async getDistribucionPorCarrera(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<Array<{ carrera: string; total: number; porcentaje: number }>> {
    return await queryBuilder
      .select('ne.programaEducativo', 'carrera')
      .addSelect('COUNT(*)', 'total')
      .groupBy('ne.programaEducativo')
      .orderBy('total', 'DESC')
      .getRawMany<CarreraRawResult>()
      .then((results) => {
        const total = results.reduce(
          (sum, result) => sum + parseInt(result.total),
          0,
        );
        return results.map((result) => ({
          carrera: result.carrera,
          total: parseInt(result.total),
          porcentaje:
            Math.round((parseInt(result.total) / total) * 100 * 100) / 100,
        }));
      });
  }

  private async getDistribucionPorMes(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any[]> {
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

    return await Promise.all(
      meses.map(async (mes, index) => {
        const total = await queryBuilder
          .clone()
          .andWhere('EXTRACT(MONTH FROM ne.fecha) = :mes', { mes: index + 1 })
          .getCount();

        return {
          mes,
          total,
        };
      }),
    );
  }

  private async getTiposNecesidadPorCarrera(
    carrera: string,
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any> {
    const carreraQuery = queryBuilder
      .clone()
      .andWhere('ne.programaEducativo = :carrera', { carrera });

    const [
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    ] = await Promise.all([
      this.getTotalPorTipo(carreraQuery, 'excepcionesConductuales'),
      this.getTotalPorTipo(carreraQuery, 'excepcionesComunicacionales'),
      this.getTotalPorTipo(carreraQuery, 'excepcionesIntelectuales'),
      this.getTotalPorTipo(carreraQuery, 'excepcionesFisicas'),
      this.getTotalPorTipo(carreraQuery, 'excepcionesSuperdotacion'),
      this.getTotalPorTipo(carreraQuery, 'otrasNecesidades'),
    ]);

    return {
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    };
  }

  private async getAlumnosPorCarrera(
    carrera: string,
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any[]> {
    return await queryBuilder
      .select(['ne.id', 'ne.nombreAlumno', 'ne.numeroMatricula'])
      .andWhere('ne.programaEducativo = :carrera', { carrera })
      .getMany()
      .then((alumnos) =>
        alumnos.map((alumno) => ({
          id: alumno.id,
          nombre: alumno.nombreAlumno,
          matricula: alumno.numeroMatricula,
          tiposNecesidad: this.getTiposNecesidadAlumno(alumno),
        })),
      );
  }

  private async getDistribucionPorTipoPorProfesor(
    profesorId: string,
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any> {
    const profesorQuery = queryBuilder
      .clone()
      .andWhere('ca.profesorId = :profesorId', { profesorId });

    const [
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    ] = await Promise.all([
      this.getTotalPorTipo(profesorQuery, 'excepcionesConductuales'),
      this.getTotalPorTipo(profesorQuery, 'excepcionesComunicacionales'),
      this.getTotalPorTipo(profesorQuery, 'excepcionesIntelectuales'),
      this.getTotalPorTipo(profesorQuery, 'excepcionesFisicas'),
      this.getTotalPorTipo(profesorQuery, 'excepcionesSuperdotacion'),
      this.getTotalPorTipo(profesorQuery, 'otrasNecesidades'),
    ]);

    return {
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    };
  }

  private async getAlumnosPorProfesor(
    profesorId: string,
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
  ): Promise<any[]> {
    return await queryBuilder
      .select([
        'ne.id',
        'ne.nombreAlumno',
        'ne.numeroMatricula',
        'ne.programaEducativo',
      ])
      .andWhere('ca.profesorId = :profesorId', { profesorId })
      .getMany()
      .then((alumnos) =>
        alumnos.map((alumno) => ({
          id: alumno.id,
          nombre: alumno.nombreAlumno,
          matricula: alumno.numeroMatricula,
          programaEducativo: alumno.programaEducativo,
          tiposNecesidad: this.getTiposNecesidadAlumno(alumno),
        })),
      );
  }

  private async getDistribucionPorTipoPorMes(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
    mes: number,
  ): Promise<any> {
    const mesQuery = queryBuilder
      .clone()
      .andWhere('EXTRACT(MONTH FROM ne.fecha) = :mes', { mes });

    const [
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    ] = await Promise.all([
      this.getTotalPorTipo(mesQuery, 'excepcionesConductuales'),
      this.getTotalPorTipo(mesQuery, 'excepcionesComunicacionales'),
      this.getTotalPorTipo(mesQuery, 'excepcionesIntelectuales'),
      this.getTotalPorTipo(mesQuery, 'excepcionesFisicas'),
      this.getTotalPorTipo(mesQuery, 'excepcionesSuperdotacion'),
      this.getTotalPorTipo(mesQuery, 'otrasNecesidades'),
    ]);

    return {
      conductuales,
      comunicacionales,
      intelectuales,
      fisicas,
      superdotacion,
      otras,
    };
  }

  private getTiposNecesidadAlumno(alumno: any): string[] {
    const tipos = [];
    if (alumno.excepcionesConductuales) tipos.push('Conductuales');
    if (alumno.excepcionesComunicacionales) tipos.push('Comunicacionales');
    if (alumno.excepcionesIntelectuales) tipos.push('Intelectuales');
    if (alumno.excepcionesFisicas) tipos.push('Físicas');
    if (alumno.excepcionesSuperdotacion) tipos.push('Superdotación');
    if (alumno.otrasNecesidades) tipos.push('Otras');
    return tipos;
  }
}
