import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SeguimientoCurso } from './entities/seguimiento-curso.entity';
import { SeguimientoDetalle } from './entities/seguimiento-detalle.entity';
import { NotificacionSeguimiento } from './entities/notificacion-seguimiento.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';
import { Usuario } from '../Usuarios/entities/usuario.entity';
import { Cuatrimestre } from '../Cuatrimestres/entities/cuatrimestre.entity';
import {
  FiltrosReporteSeguimientoDto,
  FiltrosReporteAvanceDto,
  FiltrosReporteNotificacionesDto,
  FiltrosReporteEstadisticasDto,
  FiltrosReporteRetrasosDto,
  FiltrosReporteCompletitudDto,
} from './dto/reportes.dto';
import { EstadoSeguimiento } from './entities/seguimiento-curso.entity';
import { EstadoAvance } from './entities/seguimiento-detalle.entity';
import { EstadoNotificacion } from './entities/notificacion-seguimiento.entity';

@Injectable()
export class ReportesSeguimientoService {
  constructor(
    @InjectRepository(SeguimientoCurso)
    private readonly seguimientoCursoRepository: Repository<SeguimientoCurso>,
    @InjectRepository(SeguimientoDetalle)
    private readonly seguimientoDetalleRepository: Repository<SeguimientoDetalle>,
    @InjectRepository(NotificacionSeguimiento)
    private readonly notificacionRepository: Repository<NotificacionSeguimiento>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Cuatrimestre)
    private readonly cuatrimestreRepository: Repository<Cuatrimestre>,
  ) {}

  /**
   * Genera reporte general de seguimientos con filtros avanzados
   */
  async generarReporteSeguimientos(filtros: FiltrosReporteSeguimientoDto) {
    try {
      const queryBuilder = this.seguimientoCursoRepository
        .createQueryBuilder('sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.asignatura', 'asig')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('sc.cuatrimestre', 'cuat')
        .leftJoinAndSelect('sc.revisadoPor', 'rev')
        .leftJoinAndSelect('sc.detalles', 'det');

      this.aplicarFiltrosSeguimiento(queryBuilder, filtros);

      const seguimientos = await queryBuilder.getMany();

      // Calcular métricas adicionales
      const reporte = {
        totalSeguimientos: seguimientos.length,
        resumenPorEstado: this.calcularResumenPorEstado(seguimientos),
        resumenPorCuatrimestre:
          this.calcularResumenPorCuatrimestre(seguimientos),
        resumenPorProfesor: this.calcularResumenPorProfesor(seguimientos),
        seguimientos: filtros.incluirDetalles
          ? seguimientos
          : seguimientos.map((s) => ({
              id: s.id,
              estado: s.estado,
              fechaEntregado: s.fechaEntregado,
              fechaRevision: s.fechaRevision,
              numeroRevision: s.numeroRevision,
              cargaAcademica: {
                id: s.cargaAcademica.id,
                profesor: s.cargaAcademica.profesor,
                asignatura: s.cargaAcademica.asignatura,
                grupo: s.cargaAcademica.grupo,
              },
              cuatrimestre: s.cuatrimestre,
              totalDetalles: s.detalles?.length || 0,
              detallesCompletados:
                s.detalles?.filter(
                  (d) => d.estadoAvance === EstadoAvance.COMPLETADO,
                ).length || 0,
              detallesRetrasados:
                s.detalles?.filter((d) => d.retraso).length || 0,
            })),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de seguimientos: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte detallado de avance por tema y semana
   */
  async generarReporteAvance(filtros: FiltrosReporteAvanceDto) {
    try {
      const queryBuilder = this.seguimientoDetalleRepository
        .createQueryBuilder('det')
        .leftJoinAndSelect('det.seguimientoCurso', 'sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.asignatura', 'asig')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('sc.cuatrimestre', 'cuat');

      this.aplicarFiltrosAvance(queryBuilder, filtros);

      const detalles = await queryBuilder.getMany();

      const reporte = {
        totalDetalles: detalles.length,
        resumenPorEstado: this.calcularResumenPorEstadoAvance(detalles),
        resumenPorSemana: this.calcularResumenPorSemana(detalles),
        resumenPorTema: this.calcularResumenPorTema(detalles),
        resumenPorAsignatura: this.calcularResumenPorAsignatura(detalles),
        detalles: detalles.map((det) => ({
          id: det.id,
          tema: det.tema,
          semanaTerminada: det.semanaTerminada,
          estadoAvance: det.estadoAvance,
          retraso: det.retraso,
          observaciones: det.observaciones,
          justificacion: det.justificacion,
          acciones: det.acciones,
          evidencias: det.evidencias,
          seguimiento: {
            id: det.seguimientoCurso.id,
            estado: det.seguimientoCurso.estado,
            fechaEntregado: det.seguimientoCurso.fechaEntregado,
          },
          cargaAcademica: {
            profesor: det.seguimientoCurso.cargaAcademica.profesor,
            asignatura: det.seguimientoCurso.cargaAcademica.asignatura,
            grupo: det.seguimientoCurso.cargaAcademica.grupo,
          },
        })),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de avance: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte de notificaciones del sistema
   */
  async generarReporteNotificaciones(filtros: FiltrosReporteNotificacionesDto) {
    try {
      const queryBuilder = this.notificacionRepository
        .createQueryBuilder('not')
        .leftJoinAndSelect('not.usuario', 'usr')
        .leftJoinAndSelect('not.seguimientoCurso', 'sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.asignatura', 'asig');

      this.aplicarFiltrosNotificaciones(queryBuilder, filtros);

      const notificaciones = await queryBuilder.getMany();

      const reporte = {
        totalNotificaciones: notificaciones.length,
        resumenPorTipo: this.calcularResumenPorTipoNotificacion(notificaciones),
        resumenPorEstado:
          this.calcularResumenPorEstadoNotificacion(notificaciones),
        resumenPorUsuario: this.calcularResumenPorUsuario(notificaciones),
        resumenPorFecha: this.calcularResumenPorFecha(notificaciones),
        notificaciones: notificaciones.map((not) => ({
          id: not.id,
          tipo: not.tipo,
          titulo: not.titulo,
          mensaje: not.mensaje,
          estado: not.estado,
          fechaEnvio: not.fechaEnvio,
          fechaLectura: not.fechaLectura,
          usuario: {
            id: not.usuario.id,
            nombre: not.usuario.nombre,
            email: not.usuario.email,
          },
          seguimiento: not.seguimientoCurso
            ? {
                id: not.seguimientoCurso.id,
                estado: not.seguimientoCurso.estado,
              }
            : null,
        })),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de notificaciones: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte estadístico con métricas agregadas
   */
  async generarReporteEstadisticas(filtros: FiltrosReporteEstadisticasDto) {
    try {
      const queryBuilder = this.seguimientoCursoRepository
        .createQueryBuilder('sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.asignatura', 'asig')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('sc.cuatrimestre', 'cuat')
        .leftJoinAndSelect('sc.detalles', 'det');

      this.aplicarFiltrosSeguimiento(queryBuilder, filtros);

      const seguimientos = await queryBuilder.getMany();

      const estadisticas = {
        totalSeguimientos: seguimientos.length,
        totalDetalles: seguimientos.reduce(
          (sum, sc) => sum + (sc.detalles?.length || 0),
          0,
        ),
        promedioDetallesPorSeguimiento:
          seguimientos.length > 0
            ? (
                seguimientos.reduce(
                  (sum, sc) => sum + (sc.detalles?.length || 0),
                  0,
                ) / seguimientos.length
              ).toFixed(2)
            : 0,
        distribucionEstados: this.calcularDistribucionEstados(seguimientos),
        distribucionAvance: this.calcularDistribucionAvance(seguimientos),
        metricasTiempo: this.calcularMetricasTiempo(seguimientos),
        agrupaciones: this.generarAgrupaciones(seguimientos, filtros),
      };

      return estadisticas;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte estadístico: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte específico de retrasos con análisis detallado
   */
  async generarReporteRetrasos(filtros: FiltrosReporteRetrasosDto) {
    try {
      const queryBuilder = this.seguimientoDetalleRepository
        .createQueryBuilder('det')
        .leftJoinAndSelect('det.seguimientoCurso', 'sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.asignatura', 'asig')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('sc.cuatrimestre', 'cuat')
        .where('det.retraso = :retraso', { retraso: true });

      this.aplicarFiltrosAvance(queryBuilder, filtros);

      const detallesRetrasados = await queryBuilder.getMany();

      const reporte = {
        totalRetrasos: detallesRetrasados.length,
        retrasosPorSemana: this.calcularRetrasosPorSemana(detallesRetrasados),
        retrasosPorAsignatura:
          this.calcularRetrasosPorAsignatura(detallesRetrasados),
        retrasosPorProfesor:
          this.calcularRetrasosPorProfesor(detallesRetrasados),
        retrasosPorTema: this.calcularRetrasosPorTema(detallesRetrasados),
        analisisRetrasos: this.analizarPatronesRetraso(detallesRetrasados),
        detalles: detallesRetrasados.map((det) => ({
          id: det.id,
          tema: det.tema,
          semanaTerminada: det.semanaTerminada,
          estadoAvance: det.estadoAvance,
          justificacion: filtros.incluirJustificaciones
            ? det.justificacion
            : undefined,
          acciones: filtros.incluirAccionesCorrectivas
            ? det.acciones
            : undefined,
          seguimiento: {
            id: det.seguimientoCurso.id,
            estado: det.seguimientoCurso.estado,
            fechaEntregado: det.seguimientoCurso.fechaEntregado,
          },
          cargaAcademica: {
            profesor: det.seguimientoCurso.cargaAcademica.profesor,
            asignatura: det.seguimientoCurso.cargaAcademica.asignatura,
            grupo: det.seguimientoCurso.cargaAcademica.grupo,
          },
        })),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de retrasos: ${error.message}`,
      );
    }
  }

  /**
   * Genera reporte de completitud con métricas de calidad
   */
  async generarReporteCompletitud(filtros: FiltrosReporteCompletitudDto) {
    try {
      const queryBuilder = this.seguimientoCursoRepository
        .createQueryBuilder('sc')
        .leftJoinAndSelect('sc.cargaAcademica', 'ca')
        .leftJoinAndSelect('ca.profesor', 'prof')
        .leftJoinAndSelect('ca.asignatura', 'asig')
        .leftJoinAndSelect('ca.grupo', 'grupo')
        .leftJoinAndSelect('sc.cuatrimestre', 'cuat')
        .leftJoinAndSelect('sc.detalles', 'det');

      this.aplicarFiltrosSeguimiento(queryBuilder, filtros);

      const seguimientos = await queryBuilder.getMany();

      const reporte = {
        totalSeguimientos: seguimientos.length,
        distribucionCompletitud:
          this.calcularDistribucionCompletitud(seguimientos),
        completitudPorAsignatura:
          this.calcularCompletitudPorAsignatura(seguimientos),
        completitudPorProfesor:
          this.calcularCompletitudPorProfesor(seguimientos),
        completitudPorGrupo: this.calcularCompletitudPorGrupo(seguimientos),
        metricasCalidad: filtros.incluirMetricasCalidad
          ? this.calcularMetricasCalidad(seguimientos)
          : undefined,
        seguimientos: seguimientos
          .map((sc) => {
            const totalDetalles = sc.detalles?.length || 0;
            const detallesCompletados =
              sc.detalles?.filter(
                (d) => d.estadoAvance === EstadoAvance.COMPLETADO,
              ).length || 0;
            const porcentajeCompletitud =
              totalDetalles > 0
                ? (detallesCompletados / totalDetalles) * 100
                : 0;

            return {
              id: sc.id,
              estado: sc.estado,
              porcentajeCompletitud: porcentajeCompletitud.toFixed(2),
              totalDetalles,
              detallesCompletados,
              detallesRetrasados:
                sc.detalles?.filter((d) => d.retraso).length || 0,
              cargaAcademica: {
                profesor: sc.cargaAcademica.profesor,
                asignatura: sc.cargaAcademica.asignatura,
                grupo: sc.cargaAcademica.grupo,
              },
              cuatrimestre: sc.cuatrimestre,
            };
          })
          .filter((sc) => {
            const completitud = parseFloat(sc.porcentajeCompletitud);
            return (
              completitud >= (filtros.porcentajeMinimo || 0) &&
              completitud <= (filtros.porcentajeMaximo || 100)
            );
          }),
      };

      return reporte;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de completitud: ${error.message}`,
      );
    }
  }

  // Métodos privados para aplicar filtros
  private aplicarFiltrosSeguimiento(
    queryBuilder: SelectQueryBuilder<SeguimientoCurso>,
    filtros: FiltrosReporteSeguimientoDto,
  ) {
    if (filtros.cuatrimestreId) {
      queryBuilder.andWhere('sc.cuatrimestreId = :cuatrimestreId', {
        cuatrimestreId: filtros.cuatrimestreId,
      });
    }

    if (filtros.profesorId) {
      queryBuilder.andWhere('ca.profesorId = :profesorId', {
        profesorId: filtros.profesorId,
      });
    }

    if (filtros.asignaturaId) {
      queryBuilder.andWhere('ca.asignaturaId = :asignaturaId', {
        asignaturaId: filtros.asignaturaId,
      });
    }

    if (filtros.grupoId) {
      queryBuilder.andWhere('ca.grupoId = :grupoId', {
        grupoId: filtros.grupoId,
      });
    }

    if (filtros.estado) {
      queryBuilder.andWhere('sc.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.semana) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM seguimiento_detalle sd WHERE sd.seguimiento_curso_id = sc.id AND sd.semana_terminada = :semana)',
        { semana: filtros.semana },
      );
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      queryBuilder.andWhere(
        'sc.fechaEntregado BETWEEN :fechaInicio AND :fechaFin',
        {
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        },
      );
    }

    if (filtros.conRetrasos) {
      queryBuilder.andWhere(
        'EXISTS (SELECT 1 FROM seguimiento_detalle sd WHERE sd.seguimiento_curso_id = sc.id AND sd.retraso = true)',
      );
    }

    if (filtros.pendientesRevision) {
      queryBuilder.andWhere('sc.estado IN (:...estadosPendientes)', {
        estadosPendientes: [
          EstadoSeguimiento.BORRADOR,
          EstadoSeguimiento.ENVIADO,
        ],
      });
    }
  }

  private aplicarFiltrosAvance(
    queryBuilder: SelectQueryBuilder<SeguimientoDetalle>,
    filtros: FiltrosReporteAvanceDto,
  ) {
    if (filtros.cuatrimestreId) {
      queryBuilder.andWhere('sc.cuatrimestreId = :cuatrimestreId', {
        cuatrimestreId: filtros.cuatrimestreId,
      });
    }

    if (filtros.profesorId) {
      queryBuilder.andWhere('ca.profesorId = :profesorId', {
        profesorId: filtros.profesorId,
      });
    }

    if (filtros.asignaturaId) {
      queryBuilder.andWhere('ca.asignaturaId = :asignaturaId', {
        asignaturaId: filtros.asignaturaId,
      });
    }

    if (filtros.grupoId) {
      queryBuilder.andWhere('ca.grupoId = :grupoId', {
        grupoId: filtros.grupoId,
      });
    }

    if (filtros.estado) {
      queryBuilder.andWhere('sc.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.estadoAvance) {
      queryBuilder.andWhere('det.estadoAvance = :estadoAvance', {
        estadoAvance: filtros.estadoAvance,
      });
    }

    if (filtros.tema) {
      queryBuilder.andWhere('det.tema ILIKE :tema', {
        tema: `%${filtros.tema}%`,
      });
    }

    if (filtros.semana) {
      queryBuilder.andWhere('det.semanaTerminada = :semana', {
        semana: filtros.semana,
      });
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      queryBuilder.andWhere(
        'sc.fechaEntregado BETWEEN :fechaInicio AND :fechaFin',
        {
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        },
      );
    }
  }

  private aplicarFiltrosNotificaciones(
    queryBuilder: SelectQueryBuilder<NotificacionSeguimiento>,
    filtros: FiltrosReporteNotificacionesDto,
  ) {
    if (filtros.usuarioId) {
      queryBuilder.andWhere('not.usuarioId = :usuarioId', {
        usuarioId: filtros.usuarioId,
      });
    }

    if (filtros.tipo) {
      queryBuilder.andWhere('not.tipo = :tipo', { tipo: filtros.tipo });
    }

    if (filtros.estado) {
      queryBuilder.andWhere('not.estado = :estado', { estado: filtros.estado });
    }

    if (filtros.noLeidas) {
      queryBuilder.andWhere('not.estado != :estadoLeida', {
        estadoLeida: EstadoNotificacion.LEIDA,
      });
    }

    if (filtros.fechaInicio && filtros.fechaFin) {
      queryBuilder.andWhere(
        'not.createdAt BETWEEN :fechaInicio AND :fechaFin',
        {
          fechaInicio: filtros.fechaInicio,
          fechaFin: filtros.fechaFin,
        },
      );
    }
  }

  // Métodos de cálculo de métricas
  private calcularResumenPorEstado(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<EstadoSeguimiento, number> = {} as Record<
      EstadoSeguimiento,
      number
    >;
    seguimientos.forEach((sc) => {
      resumen[sc.estado] = (resumen[sc.estado] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorCuatrimestre(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<string, number> = {};
    seguimientos.forEach((sc) => {
      const nombreCuatrimestre =
        sc.cuatrimestre?.nombreGenerado || 'Sin cuatrimestre';
      resumen[nombreCuatrimestre] = (resumen[nombreCuatrimestre] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorProfesor(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<string, number> = {};
    seguimientos.forEach((sc) => {
      const nombreProfesor =
        sc.cargaAcademica?.profesor?.nombre || 'Sin profesor';
      resumen[nombreProfesor] = (resumen[nombreProfesor] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorEstadoAvance(detalles: SeguimientoDetalle[]) {
    const resumen: Record<EstadoAvance, number> = {} as Record<
      EstadoAvance,
      number
    >;
    detalles.forEach((det) => {
      resumen[det.estadoAvance] = (resumen[det.estadoAvance] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorSemana(detalles: SeguimientoDetalle[]) {
    const resumen: Record<number, number> = {};
    detalles.forEach((det) => {
      resumen[det.semanaTerminada] = (resumen[det.semanaTerminada] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorTema(detalles: SeguimientoDetalle[]) {
    const resumen: Record<string, number> = {};
    detalles.forEach((det) => {
      resumen[det.tema] = (resumen[det.tema] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorAsignatura(detalles: SeguimientoDetalle[]) {
    const resumen: Record<string, number> = {};
    detalles.forEach((det) => {
      const nombreAsignatura =
        det.seguimientoCurso?.cargaAcademica?.asignatura || 'Sin asignatura';
      resumen[nombreAsignatura] = (resumen[nombreAsignatura] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorTipoNotificacion(
    notificaciones: NotificacionSeguimiento[],
  ) {
    const resumen: Record<string, number> = {};
    notificaciones.forEach((not) => {
      resumen[not.tipo] = (resumen[not.tipo] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorEstadoNotificacion(
    notificaciones: NotificacionSeguimiento[],
  ) {
    const resumen: Record<EstadoNotificacion, number> = {} as Record<
      EstadoNotificacion,
      number
    >;
    notificaciones.forEach((not) => {
      resumen[not.estado] = (resumen[not.estado] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorUsuario(notificaciones: NotificacionSeguimiento[]) {
    const resumen: Record<string, number> = {};
    notificaciones.forEach((not) => {
      const nombreUsuario = not.usuario?.nombre || 'Sin usuario';
      resumen[nombreUsuario] = (resumen[nombreUsuario] || 0) + 1;
    });
    return resumen;
  }

  private calcularResumenPorFecha(notificaciones: NotificacionSeguimiento[]) {
    const resumen: Record<string, number> = {};
    notificaciones.forEach((not) => {
      const fecha = not.createdAt?.toISOString().split('T')[0] || 'Sin fecha';
      resumen[fecha] = (resumen[fecha] || 0) + 1;
    });
    return resumen;
  }

  private calcularDistribucionEstados(seguimientos: SeguimientoCurso[]) {
    return this.calcularResumenPorEstado(seguimientos);
  }

  private calcularDistribucionAvance(seguimientos: SeguimientoCurso[]) {
    const distribucion: Record<EstadoAvance, number> = {} as Record<
      EstadoAvance,
      number
    >;
    seguimientos.forEach((sc) => {
      sc.detalles?.forEach((det) => {
        distribucion[det.estadoAvance] =
          (distribucion[det.estadoAvance] || 0) + 1;
      });
    });
    return distribucion;
  }

  private calcularMetricasTiempo(seguimientos: SeguimientoCurso[]) {
    const metricas = {
      promedioDiasEntrega: 0,
      promedioDiasRevision: 0,
      seguimientosSinFechaEntrega: 0,
      seguimientosSinFechaRevision: 0,
    };

    let totalDiasEntrega = 0;
    let totalDiasRevision = 0;
    let contadorEntrega = 0;
    let contadorRevision = 0;

    seguimientos.forEach((sc) => {
      if (sc.fechaEntregado) {
        const dias = Math.ceil(
          (new Date().getTime() - sc.fechaEntregado.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalDiasEntrega += dias;
        contadorEntrega++;
      } else {
        metricas.seguimientosSinFechaEntrega++;
      }

      if (sc.fechaRevision) {
        const dias = Math.ceil(
          (sc.fechaRevision.getTime() - sc.fechaEntregado.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalDiasRevision += dias;
        contadorRevision++;
      } else {
        metricas.seguimientosSinFechaRevision++;
      }
    });

    metricas.promedioDiasEntrega =
      contadorEntrega > 0 ? totalDiasEntrega / contadorEntrega : 0;
    metricas.promedioDiasRevision =
      contadorRevision > 0 ? totalDiasRevision / contadorRevision : 0;

    return metricas;
  }

  private generarAgrupaciones(
    seguimientos: SeguimientoCurso[],
    filtros: FiltrosReporteEstadisticasDto,
  ) {
    const agrupaciones: Record<string, any> = {};

    if (filtros.agruparPorSemana) {
      agrupaciones.porSemana = this.calcularResumenPorSemana(
        seguimientos.flatMap((sc) => sc.detalles || []),
      );
    }

    if (filtros.agruparPorAsignatura) {
      agrupaciones.porAsignatura = this.calcularResumenPorAsignatura(
        seguimientos.flatMap((sc) => sc.detalles || []),
      );
    }

    if (filtros.agruparPorGrupo) {
      const resumen: Record<string, number> = {};
      seguimientos.forEach((sc) => {
        const nombreGrupo =
          sc.cargaAcademica?.grupo?.nombreGenerado || 'Sin grupo';
        resumen[nombreGrupo] = (resumen[nombreGrupo] || 0) + 1;
      });
      agrupaciones.porGrupo = resumen;
    }

    return agrupaciones;
  }

  private calcularRetrasosPorSemana(detalles: SeguimientoDetalle[]) {
    return this.calcularResumenPorSemana(detalles);
  }

  private calcularRetrasosPorAsignatura(detalles: SeguimientoDetalle[]) {
    return this.calcularResumenPorAsignatura(detalles);
  }

  private calcularRetrasosPorProfesor(detalles: SeguimientoDetalle[]) {
    const resumen: Record<string, number> = {};
    detalles.forEach((det) => {
      const nombreProfesor =
        det.seguimientoCurso?.cargaAcademica?.profesor?.nombre ||
        'Sin profesor';
      resumen[nombreProfesor] = (resumen[nombreProfesor] || 0) + 1;
    });
    return resumen;
  }

  private calcularRetrasosPorTema(detalles: SeguimientoDetalle[]) {
    return this.calcularResumenPorTema(detalles);
  }

  private analizarPatronesRetraso(detalles: SeguimientoDetalle[]) {
    const analisis: {
      temasMasRetrasados: Record<string, number>;
      semanasConMasRetrasos: Record<number, number>;
      profesoresConMasRetrasos: Record<string, number>;
      asignaturasConMasRetrasos: Record<string, number>;
    } = {
      temasMasRetrasados: {},
      semanasConMasRetrasos: {},
      profesoresConMasRetrasos: {},
      asignaturasConMasRetrasos: {},
    };

    detalles.forEach((det) => {
      // Tema más retrasado
      analisis.temasMasRetrasados[det.tema] =
        (analisis.temasMasRetrasados[det.tema] || 0) + 1;

      // Semana con más retrasos
      analisis.semanasConMasRetrasos[det.semanaTerminada] =
        (analisis.semanasConMasRetrasos[det.semanaTerminada] || 0) + 1;

      // Profesor con más retrasos
      const nombreProfesor =
        det.seguimientoCurso?.cargaAcademica?.profesor?.nombre ||
        'Sin profesor';
      analisis.profesoresConMasRetrasos[nombreProfesor] =
        (analisis.profesoresConMasRetrasos[nombreProfesor] || 0) + 1;

      // Asignatura con más retrasos
      const nombreAsignatura =
        det.seguimientoCurso?.cargaAcademica?.asignatura || 'Sin asignatura';
      analisis.asignaturasConMasRetrasos[nombreAsignatura] =
        (analisis.asignaturasConMasRetrasos[nombreAsignatura] || 0) + 1;
    });

    return analisis;
  }

  private calcularDistribucionCompletitud(seguimientos: SeguimientoCurso[]) {
    const distribucion: Record<string, number> = {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-100%': 0,
    };

    seguimientos.forEach((sc) => {
      const totalDetalles = sc.detalles?.length || 0;
      if (totalDetalles > 0) {
        const detallesCompletados =
          sc.detalles?.filter((d) => d.estadoAvance === EstadoAvance.COMPLETADO)
            .length || 0;
        const porcentaje = (detallesCompletados / totalDetalles) * 100;

        if (porcentaje <= 25) distribucion['0-25%']++;
        else if (porcentaje <= 50) distribucion['26-50%']++;
        else if (porcentaje <= 75) distribucion['51-75%']++;
        else distribucion['76-100%']++;
      }
    });

    return distribucion;
  }

  private calcularCompletitudPorAsignatura(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<
      string,
      { total: number; completados: number; porcentaje: string }
    > = {};
    seguimientos.forEach((sc) => {
      const nombreAsignatura =
        sc.cargaAcademica?.asignatura || 'Sin asignatura';
      if (!resumen[nombreAsignatura]) {
        resumen[nombreAsignatura] = {
          total: 0,
          completados: 0,
          porcentaje: '0',
        };
      }

      const totalDetalles = sc.detalles?.length || 0;
      const detallesCompletados =
        sc.detalles?.filter((d) => d.estadoAvance === EstadoAvance.COMPLETADO)
          .length || 0;

      resumen[nombreAsignatura].total += totalDetalles;
      resumen[nombreAsignatura].completados += detallesCompletados;
    });

    // Calcular porcentajes
    Object.keys(resumen).forEach((asignatura) => {
      if (resumen[asignatura].total > 0) {
        resumen[asignatura].porcentaje = (
          (resumen[asignatura].completados / resumen[asignatura].total) *
          100
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularCompletitudPorProfesor(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<
      string,
      { total: number; completados: number; porcentaje: string }
    > = {};
    seguimientos.forEach((sc) => {
      const nombreProfesor =
        sc.cargaAcademica?.profesor?.nombre || 'Sin profesor';
      if (!resumen[nombreProfesor]) {
        resumen[nombreProfesor] = { total: 0, completados: 0, porcentaje: '0' };
      }

      const totalDetalles = sc.detalles?.length || 0;
      const detallesCompletados =
        sc.detalles?.filter((d) => d.estadoAvance === EstadoAvance.COMPLETADO)
          .length || 0;

      resumen[nombreProfesor].total += totalDetalles;
      resumen[nombreProfesor].completados += detallesCompletados;
    });

    // Calcular porcentajes
    Object.keys(resumen).forEach((profesor) => {
      if (resumen[profesor].total > 0) {
        resumen[profesor].porcentaje = (
          (resumen[profesor].completados / resumen[profesor].total) *
          100
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularCompletitudPorGrupo(seguimientos: SeguimientoCurso[]) {
    const resumen: Record<
      string,
      { total: number; completados: number; porcentaje: string }
    > = {};
    seguimientos.forEach((sc) => {
      const nombreGrupo =
        sc.cargaAcademica?.grupo?.nombreGenerado || 'Sin grupo';
      if (!resumen[nombreGrupo]) {
        resumen[nombreGrupo] = { total: 0, completados: 0, porcentaje: '0' };
      }

      const totalDetalles = sc.detalles?.length || 0;
      const detallesCompletados =
        sc.detalles?.filter((d) => d.estadoAvance === EstadoAvance.COMPLETADO)
          .length || 0;

      resumen[nombreGrupo].total += totalDetalles;
      resumen[nombreGrupo].completados += detallesCompletados;
    });

    // Calcular porcentajes
    Object.keys(resumen).forEach((grupo) => {
      if (resumen[grupo].total > 0) {
        resumen[grupo].porcentaje = (
          (resumen[grupo].completados / resumen[grupo].total) *
          100
        ).toFixed(2);
      }
    });

    return resumen;
  }

  private calcularMetricasCalidad(seguimientos: SeguimientoCurso[]) {
    const metricas: {
      seguimientosConObservaciones: number;
      seguimientosConEvidencias: number;
      seguimientosConAccionesCorrectivas: number;
      promedioObservacionesPorDetalle: string | number;
      promedioEvidenciasPorDetalle: string | number;
    } = {
      seguimientosConObservaciones: 0,
      seguimientosConEvidencias: 0,
      seguimientosConAccionesCorrectivas: 0,
      promedioObservacionesPorDetalle: 0,
      promedioEvidenciasPorDetalle: 0,
    };

    let totalObservaciones = 0;
    let totalEvidencias = 0;
    let totalDetalles = 0;

    seguimientos.forEach((sc) => {
      sc.detalles?.forEach((det) => {
        totalDetalles++;
        if (det.observaciones) totalObservaciones++;
        if (det.evidencias) totalEvidencias++;
        if (det.acciones) metricas.seguimientosConAccionesCorrectivas++;
      });
    });

    metricas.seguimientosConObservaciones = totalObservaciones;
    metricas.seguimientosConEvidencias = totalEvidencias;
    metricas.promedioObservacionesPorDetalle =
      totalDetalles > 0 ? (totalObservaciones / totalDetalles).toFixed(2) : 0;
    metricas.promedioEvidenciasPorDetalle =
      totalDetalles > 0 ? (totalEvidencias / totalDetalles).toFixed(2) : 0;

    return metricas;
  }
}
