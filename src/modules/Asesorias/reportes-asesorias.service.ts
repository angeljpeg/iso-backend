import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Asesoria } from './entities/asesoria.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';
import { Usuario } from '../Usuarios/entities/usuario.entity';
import { Cuatrimestre } from '../Cuatrimestres/entities/cuatrimestre.entity';
import { Grupo } from '../Grupos/entities/grupo.entity';
import {
  FiltrosReporteAsesoriasDto,
  FiltrosReporteAsesoriasPorCarreraDto,
  FiltrosReporteAsesoriasPorProfesorDto,
  FiltrosReporteAsesoriasPorTemaDto,
  FiltrosReporteEstadisticasAsesoriasDto,
} from './dto/reportes-asesorias.dto';

@Injectable()
export class ReportesAsesoriasService {
  constructor(
    @InjectRepository(Asesoria)
    private readonly asesoriaRepository: Repository<Asesoria>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cuatrimestre)
    private readonly cuatrimestreRepository: Repository<Cuatrimestre>,
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
  ) {}

  /**
   * Genera reporte general de asesorías con filtros avanzados
   */
  async generarReporteAsesorias(filtros: FiltrosReporteAsesoriasDto) {
    try {
      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('ases')
        .leftJoinAndSelect('ases.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('ca.cuatrimestre', 'cuat');

      this.aplicarFiltrosAsesorias(queryBuilder, filtros);

      const asesorias = await queryBuilder.getMany();

      // Calcular métricas adicionales
      const reporte = {
        totalAsesorias: asesorias.length,
        resumenPorCarrera: this.calcularResumenPorCarrera(asesorias),
        resumenPorCuatrimestre: this.calcularResumenPorCuatrimestre(asesorias),
        resumenPorProfesor: this.calcularResumenPorProfesor(asesorias),
        resumenPorTema: this.calcularResumenPorTema(asesorias),
        resumenPorGrupo: this.calcularResumenPorGrupo(asesorias),
        totalAlumnosAtendidos: asesorias.reduce(
          (sum, a) => sum + a.numeroAlumnos,
          0,
        ),
        totalHorasAsesorias: asesorias.reduce(
          (sum, a) => sum + a.duracionAsesoria,
          0,
        ),
        asesorias: filtros.incluirDetalles
          ? asesorias
          : asesorias.map((a) => ({
              id: a.id,
              temaAsesoria: a.temaAsesoria,
              fecha: a.fecha,
              numeroAlumnos: a.numeroAlumnos,
              nombreAlumno: a.nombreAlumno,
              duracionAsesoria: a.duracionAsesoria,
              cargaAcademica: {
                id: a.cargaAcademica.id,
                carrera: a.cargaAcademica.carrera,
                asignatura: a.cargaAcademica.asignatura,
                profesor: a.cargaAcademica.profesor,
                grupo: a.cargaAcademica.grupo,
              },
              cuatrimestre: a.cargaAcademica.cuatrimestre,
            })),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de asesorías: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte de asesorías agrupadas por carrera
   */
  async generarReporteAsesoriasPorCarrera(
    filtros: FiltrosReporteAsesoriasPorCarreraDto,
  ) {
    try {
      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('ases')
        .leftJoinAndSelect('ases.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('ca.cuatrimestre', 'cuat');

      this.aplicarFiltrosAsesorias(queryBuilder, filtros);

      const asesorias = await queryBuilder.getMany();

      const reporte = {
        totalAsesorias: asesorias.length,
        resumenPorCarrera: this.calcularResumenDetalladoPorCarrera(asesorias),
        metricasGenerales: {
          totalAlumnosAtendidos: asesorias.reduce(
            (sum, a) => sum + a.numeroAlumnos,
            0,
          ),
          totalHorasAsesorias: asesorias.reduce(
            (sum, a) => sum + a.duracionAsesoria,
            0,
          ),
          promedioAlumnosPorAsesoria:
            asesorias.length > 0
              ? (
                  asesorias.reduce((sum, a) => sum + a.numeroAlumnos, 0) /
                  asesorias.length
                ).toFixed(2)
              : 0,
          promedioDuracionPorAsesoria:
            asesorias.length > 0
              ? (
                  asesorias.reduce((sum, a) => sum + a.duracionAsesoria, 0) /
                  asesorias.length
                ).toFixed(2)
              : 0,
        },
        asesorias: filtros.incluirDetalles ? asesorias : undefined,
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de asesorías por carrera: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte de asesorías por profesor
   */
  async generarReporteAsesoriasPorProfesor(
    filtros: FiltrosReporteAsesoriasPorProfesorDto,
  ) {
    try {
      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('ases')
        .leftJoinAndSelect('ases.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('ca.cuatrimestre', 'cuat');

      this.aplicarFiltrosAsesorias(queryBuilder, filtros);

      const asesorias = await queryBuilder.getMany();

      const reporte = {
        totalAsesorias: asesorias.length,
        resumenPorProfesor: this.calcularResumenDetalladoPorProfesor(asesorias),
        metricasGenerales: {
          totalAlumnosAtendidos: asesorias.reduce(
            (sum, a) => sum + a.numeroAlumnos,
            0,
          ),
          totalHorasAsesorias: asesorias.reduce(
            (sum, a) => sum + a.duracionAsesoria,
            0,
          ),
          promedioAsesoriasPorProfesor:
            this.calcularPromedioAsesoriasPorProfesor(asesorias),
        },
        asesorias: filtros.incluirDetalles ? asesorias : undefined,
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de asesorías por profesor: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte de asesorías por tema
   */
  async generarReporteAsesoriasPorTema(
    filtros: FiltrosReporteAsesoriasPorTemaDto,
  ) {
    try {
      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('ases')
        .leftJoinAndSelect('ases.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('ca.cuatrimestre', 'cuat');

      this.aplicarFiltrosAsesorias(queryBuilder, filtros);

      const asesorias = await queryBuilder.getMany();

      const reporte = {
        totalAsesorias: asesorias.length,
        resumenPorTema: this.calcularResumenDetalladoPorTema(asesorias),
        metricasGenerales: {
          totalAlumnosAtendidos: asesorias.reduce(
            (sum, a) => sum + a.numeroAlumnos,
            0,
          ),
          totalHorasAsesorias: asesorias.reduce(
            (sum, a) => sum + a.duracionAsesoria,
            0,
          ),
          temasUnicos: Object.keys(this.calcularResumenPorTema(asesorias))
            .length,
        },
        asesorias: filtros.incluirDetalles ? asesorias : undefined,
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de asesorías por tema: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte estadístico con métricas agregadas
   */
  async generarReporteEstadisticas(
    filtros: FiltrosReporteEstadisticasAsesoriasDto,
  ) {
    try {
      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('ases')
        .leftJoinAndSelect('ases.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('ca.cuatrimestre', 'cuat');

      this.aplicarFiltrosAsesorias(queryBuilder, filtros);

      const asesorias = await queryBuilder.getMany();

      const estadisticas = {
        totalAsesorias: asesorias.length,
        totalAlumnosAtendidos: asesorias.reduce(
          (sum, a) => sum + a.numeroAlumnos,
          0,
        ),
        totalHorasAsesorias: asesorias.reduce(
          (sum, a) => sum + a.duracionAsesoria,
          0,
        ),
        promedioAlumnosPorAsesoria:
          asesorias.length > 0
            ? (
                asesorias.reduce((sum, a) => sum + a.numeroAlumnos, 0) /
                asesorias.length
              ).toFixed(2)
            : 0,
        promedioDuracionPorAsesoria:
          asesorias.length > 0
            ? (
                asesorias.reduce((sum, a) => sum + a.duracionAsesoria, 0) /
                asesorias.length
              ).toFixed(2)
            : 0,
        distribucionPorCarrera: this.calcularResumenPorCarrera(asesorias),
        distribucionPorCuatrimestre:
          this.calcularResumenPorCuatrimestre(asesorias),
        distribucionPorProfesor: this.calcularResumenPorProfesor(asesorias),
        distribucionPorTema: this.calcularResumenPorTema(asesorias),
        distribucionPorGrupo: this.calcularResumenPorGrupo(asesorias),
        agrupaciones: this.generarAgrupaciones(asesorias, filtros),
      };

      return estadisticas;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte estadístico: ${error.message}`,
      );
    }
  }

  // Métodos privados para aplicar filtros
  private aplicarFiltrosAsesorias(
    queryBuilder: SelectQueryBuilder<Asesoria>,
    filtros: any,
  ) {
    if (filtros.cuatrimestreId) {
      queryBuilder.andWhere('ca.cuatrimestreId = :cuatrimestreId', {
        cuatrimestreId: filtros.cuatrimestreId,
      });
    }

    if (filtros.profesorId) {
      queryBuilder.andWhere('ca.profesorId = :profesorId', {
        profesorId: filtros.profesorId,
      });
    }

    if (filtros.carrera) {
      queryBuilder.andWhere('ca.carrera ILIKE :carrera', {
        carrera: `%${filtros.carrera}%`,
      });
    }

    if (filtros.asignatura) {
      queryBuilder.andWhere('ca.asignatura ILIKE :asignatura', {
        asignatura: `%${filtros.asignatura}%`,
      });
    }

    if (filtros.grupoId) {
      queryBuilder.andWhere('ca.grupoId = :grupoId', {
        grupoId: filtros.grupoId,
      });
    }

    if (filtros.temaAsesoria) {
      queryBuilder.andWhere('ases.temaAsesoria ILIKE :temaAsesoria', {
        temaAsesoria: `%${filtros.temaAsesoria}%`,
      });
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      queryBuilder.andWhere('ases.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
      });
    }

    if (filtros.numeroAlumnosMinimo) {
      queryBuilder.andWhere('ases.numeroAlumnos >= :numeroAlumnosMinimo', {
        numeroAlumnosMinimo: filtros.numeroAlumnosMinimo,
      });
    }

    if (filtros.numeroAlumnosMaximo) {
      queryBuilder.andWhere('ases.numeroAlumnos <= :numeroAlumnosMaximo', {
        numeroAlumnosMaximo: filtros.numeroAlumnosMaximo,
      });
    }

    if (filtros.duracionMinima) {
      queryBuilder.andWhere('ases.duracionAsesoria >= :duracionMinima', {
        duracionMinima: filtros.duracionMinima,
      });
    }

    if (filtros.duracionMaxima) {
      queryBuilder.andWhere('ases.duracionAsesoria <= :duracionMaxima', {
        duracionMaxima: filtros.duracionMaxima,
      });
    }
  }

  // Métodos de cálculo de métricas
  private calcularResumenPorCarrera(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const carrera = ases.cargaAcademica?.carrera || 'Sin carrera';
      resumen[carrera] = (resumen[carrera] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorCuatrimestre(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const nombreCuatrimestre =
        ases.cargaAcademica?.cuatrimestre?.nombreGenerado || 'Sin cuatrimestre';
      resumen[nombreCuatrimestre] = (resumen[nombreCuatrimestre] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorProfesor(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const nombreProfesor =
        ases.cargaAcademica?.profesor?.nombre || 'Sin profesor';
      resumen[nombreProfesor] = (resumen[nombreProfesor] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorTema(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const tema = ases.temaAsesoria || 'Sin tema';
      resumen[tema] = (resumen[tema] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorGrupo(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const nombreGrupo =
        ases.cargaAcademica?.grupo?.nombreGenerado || 'Sin grupo';
      resumen[nombreGrupo] = (resumen[nombreGrupo] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenDetalladoPorCarrera(asesorias: Asesoria[]) {
    const resumen: Record<
      string,
      {
        totalAsesorias: number;
        totalAlumnos: number;
        totalHoras: number;
        promedioAlumnos: string;
        promedioDuracion: string;
        asignaturas: Record<string, number>;
        profesores: Record<string, number>;
      }
    > = {};

    asesorias.forEach((ases) => {
      const carrera = ases.cargaAcademica?.carrera || 'Sin carrera';
      const asignatura = ases.cargaAcademica?.asignatura || 'Sin asignatura';
      const profesor = ases.cargaAcademica?.profesor?.nombre || 'Sin profesor';

      if (!resumen[carrera]) {
        resumen[carrera] = {
          totalAsesorias: 0,
          totalAlumnos: 0,
          totalHoras: 0,
          promedioAlumnos: '0',
          promedioDuracion: '0',
          asignaturas: {},
          profesores: {},
        };
      }

      resumen[carrera].totalAsesorias++;
      resumen[carrera].totalAlumnos += ases.numeroAlumnos;
      resumen[carrera].totalHoras += ases.duracionAsesoria;
      resumen[carrera].asignaturas[asignatura] =
        (resumen[carrera].asignaturas[asignatura] || 0) + 1;
      resumen[carrera].profesores[profesor] =
        (resumen[carrera].profesores[profesor] || 0) + 1;
    });

    // Calcular promedios
    Object.keys(resumen).forEach((carrera) => {
      if (resumen[carrera].totalAsesorias > 0) {
        resumen[carrera].promedioAlumnos = (
          resumen[carrera].totalAlumnos / resumen[carrera].totalAsesorias
        ).toFixed(2);
        resumen[carrera].promedioDuracion = (
          resumen[carrera].totalHoras / resumen[carrera].totalAsesorias
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularResumenDetalladoPorProfesor(asesorias: Asesoria[]) {
    const resumen: Record<
      string,
      {
        totalAsesorias: number;
        totalAlumnos: number;
        totalHoras: number;
        promedioAlumnos: string;
        promedioDuracion: string;
        carreras: Record<string, number>;
        asignaturas: Record<string, number>;
        grupos: Record<string, number>;
      }
    > = {};

    asesorias.forEach((ases) => {
      const profesor = ases.cargaAcademica?.profesor?.nombre || 'Sin profesor';
      const carrera = ases.cargaAcademica?.carrera || 'Sin carrera';
      const asignatura = ases.cargaAcademica?.asignatura || 'Sin asignatura';
      const grupo = ases.cargaAcademica?.grupo?.nombreGenerado || 'Sin grupo';

      if (!resumen[profesor]) {
        resumen[profesor] = {
          totalAsesorias: 0,
          totalAlumnos: 0,
          totalHoras: 0,
          promedioAlumnos: '0',
          promedioDuracion: '0',
          carreras: {},
          asignaturas: {},
          grupos: {},
        };
      }

      resumen[profesor].totalAsesorias++;
      resumen[profesor].totalAlumnos += ases.numeroAlumnos;
      resumen[profesor].totalHoras += ases.duracionAsesoria;
      resumen[profesor].carreras[carrera] =
        (resumen[profesor].carreras[carrera] || 0) + 1;
      resumen[profesor].asignaturas[asignatura] =
        (resumen[profesor].asignaturas[asignatura] || 0) + 1;
      resumen[profesor].grupos[grupo] =
        (resumen[profesor].grupos[grupo] || 0) + 1;
    });

    // Calcular promedios
    Object.keys(resumen).forEach((profesor) => {
      if (resumen[profesor].totalAsesorias > 0) {
        resumen[profesor].promedioAlumnos = (
          resumen[profesor].totalAlumnos / resumen[profesor].totalAsesorias
        ).toFixed(2);
        resumen[profesor].promedioDuracion = (
          resumen[profesor].totalHoras / resumen[profesor].totalAsesorias
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularResumenDetalladoPorTema(asesorias: Asesoria[]) {
    const resumen: Record<
      string,
      {
        totalAsesorias: number;
        totalAlumnos: number;
        totalHoras: number;
        promedioAlumnos: string;
        promedioDuracion: string;
        carreras: Record<string, number>;
        asignaturas: Record<string, number>;
        profesores: Record<string, number>;
      }
    > = {};

    asesorias.forEach((ases) => {
      const tema = ases.temaAsesoria || 'Sin tema';
      const carrera = ases.cargaAcademica?.carrera || 'Sin carrera';
      const asignatura = ases.cargaAcademica?.asignatura || 'Sin asignatura';
      const profesor = ases.cargaAcademica?.profesor?.nombre || 'Sin profesor';

      if (!resumen[tema]) {
        resumen[tema] = {
          totalAsesorias: 0,
          totalAlumnos: 0,
          totalHoras: 0,
          promedioAlumnos: '0',
          promedioDuracion: '0',
          carreras: {},
          asignaturas: {},
          profesores: {},
        };
      }

      resumen[tema].totalAsesorias++;
      resumen[tema].totalAlumnos += ases.numeroAlumnos;
      resumen[tema].totalHoras += ases.duracionAsesoria;
      resumen[tema].carreras[carrera] =
        (resumen[tema].carreras[carrera] || 0) + 1;
      resumen[tema].asignaturas[asignatura] =
        (resumen[tema].asignaturas[asignatura] || 0) + 1;
      resumen[tema].profesores[profesor] =
        (resumen[tema].profesores[profesor] || 0) + 1;
    });

    // Calcular promedios
    Object.keys(resumen).forEach((tema) => {
      if (resumen[tema].totalAsesorias > 0) {
        resumen[tema].promedioAlumnos = (
          resumen[tema].totalAlumnos / resumen[tema].totalAsesorias
        ).toFixed(2);
        resumen[tema].promedioDuracion = (
          resumen[tema].totalHoras / resumen[tema].totalAsesorias
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularPromedioAsesoriasPorProfesor(asesorias: Asesoria[]) {
    const profesores = new Set();
    asesorias.forEach((ases) => {
      const profesorId = ases.cargaAcademica?.profesor?.id;
      if (profesorId) profesores.add(profesorId);
    });

    return profesores.size > 0
      ? (asesorias.length / profesores.size).toFixed(2)
      : 0;
  }

  private generarAgrupaciones(
    asesorias: Asesoria[],
    filtros: FiltrosReporteEstadisticasAsesoriasDto,
  ) {
    const agrupaciones: Record<string, any> = {};

    if (filtros.agruparPorSemana) {
      agrupaciones.porSemana = this.calcularResumenPorSemana(asesorias);
    }

    if (filtros.agruparPorCarrera) {
      agrupaciones.porCarrera = this.calcularResumenPorCarrera(asesorias);
    }

    if (filtros.agruparPorProfesor) {
      agrupaciones.porProfesor = this.calcularResumenPorProfesor(asesorias);
    }

    if (filtros.agruparPorAsignatura) {
      agrupaciones.porAsignatura = this.calcularResumenPorAsignatura(asesorias);
    }

    if (filtros.agruparPorGrupo) {
      agrupaciones.porGrupo = this.calcularResumenPorGrupo(asesorias);
    }

    return agrupaciones;
  }

  private calcularResumenPorSemana(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const fecha = new Date(ases.fecha);
      const semana = this.obtenerSemanaDelAno(fecha);
      resumen[semana] = (resumen[semana] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorAsignatura(asesorias: Asesoria[]) {
    const resumen: Record<string, number> = {};
    asesorias.forEach((ases) => {
      const asignatura = ases.cargaAcademica?.asignatura || 'Sin asignatura';
      resumen[asignatura] = (resumen[asignatura] || 0) + 1;
    });
    return resumen;
  }

  private obtenerSemanaDelAno(fecha: Date): string {
    const inicioAno = new Date(fecha.getFullYear(), 0, 1);
    const dias = Math.floor(
      (fecha.getTime() - inicioAno.getTime()) / (24 * 60 * 60 * 1000),
    );
    const semana = Math.ceil((dias + inicioAno.getDay() + 1) / 7);
    return `Semana ${semana}`;
  }
}
