import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportesSeguimientoService } from './reportes-seguimiento.service';
import {
  FiltrosReporteSeguimientoDto,
  FiltrosReporteAvanceDto,
  FiltrosReporteNotificacionesDto,
  FiltrosReporteEstadisticasDto,
  FiltrosReporteRetrasosDto,
  FiltrosReporteCompletitudDto,
} from './dto/reportes.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('reportes-seguimiento')
@Controller('reportes-seguimiento')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt-auth')
export class ReportesSeguimientoController {
  constructor(
    private readonly reportesSeguimientoService: ReportesSeguimientoService,
  ) {}

  @Get('seguimientos')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Generar reporte general de seguimientos',
    description:
      'Genera un reporte completo de seguimientos con filtros avanzados y métricas agregadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de seguimientos generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalSeguimientos: { type: 'number' },
        resumenPorEstado: { type: 'object' },
        resumenPorCuatrimestre: { type: 'object' },
        resumenPorProfesor: { type: 'object' },
        seguimientos: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteSeguimientos(
    @Query() filtros: FiltrosReporteSeguimientoDto,
    @Request() _req: AuthenticatedRequest,
  ) {
    try {
      return await this.reportesSeguimientoService.generarReporteSeguimientos(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de seguimientos: ${error.message}`,
      );
    }
  }

  @Get('avance')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de avance por tema y semana',
    description:
      'Genera un reporte detallado del avance de los temas por semana con métricas de progreso',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de avance generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalDetalles: { type: 'number' },
        resumenPorEstado: { type: 'object' },
        resumenPorSemana: { type: 'object' },
        resumenPorTema: { type: 'object' },
        resumenPorAsignatura: { type: 'object' },
        detalles: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteAvance(
    @Query() filtros: FiltrosReporteAvanceDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      // Los profesores solo pueden ver reportes de sus propias asignaturas
      if (
        req.user.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO ||
        req.user.rol === RolUsuario.PROFESOR_ASIGNATURA
      ) {
        filtros.profesorId = req.user.id;
      }

      return await this.reportesSeguimientoService.generarReporteAvance(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de avance: ${error.message}`,
      );
    }
  }

  @Get('notificaciones')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Generar reporte de notificaciones del sistema',
    description:
      'Genera un reporte completo de las notificaciones enviadas con análisis de efectividad',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de notificaciones generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalNotificaciones: { type: 'number' },
        resumenPorTipo: { type: 'object' },
        resumenPorEstado: { type: 'object' },
        resumenPorUsuario: { type: 'object' },
        resumenPorFecha: { type: 'object' },
        notificaciones: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteNotificaciones(
    @Query() filtros: FiltrosReporteNotificacionesDto,
    @Request() _req: AuthenticatedRequest,
  ) {
    try {
      return await this.reportesSeguimientoService.generarReporteNotificaciones(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de notificaciones: ${error.message}`,
      );
    }
  }

  @Get('estadisticas')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Generar reporte estadístico con métricas agregadas',
    description:
      'Genera un reporte estadístico completo con métricas de tiempo, distribución y agrupaciones personalizables',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte estadístico generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalSeguimientos: { type: 'number' },
        totalDetalles: { type: 'number' },
        promedioDetallesPorSeguimiento: { type: 'string' },
        distribucionEstados: { type: 'object' },
        distribucionAvance: { type: 'object' },
        metricasTiempo: { type: 'object' },
        agrupaciones: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteEstadisticas(
    @Query() filtros: FiltrosReporteEstadisticasDto,
    @Request() _req: AuthenticatedRequest,
  ) {
    try {
      return await this.reportesSeguimientoService.generarReporteEstadisticas(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte estadístico: ${error.message}`,
      );
    }
  }

  @Get('retrasos')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte específico de retrasos con análisis detallado',
    description:
      'Genera un reporte enfocado en los retrasos con análisis de patrones y acciones correctivas',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de retrasos generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalRetrasos: { type: 'number' },
        retrasosPorSemana: { type: 'object' },
        retrasosPorAsignatura: { type: 'object' },
        retrasosPorProfesor: { type: 'object' },
        retrasosPorTema: { type: 'object' },
        analisisRetrasos: { type: 'object' },
        detalles: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteRetrasos(
    @Query() filtros: FiltrosReporteRetrasosDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      // Los profesores solo pueden ver reportes de sus propias asignaturas
      if (
        req.user.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO ||
        req.user.rol === RolUsuario.PROFESOR_ASIGNATURA
      ) {
        filtros.profesorId = req.user.id;
      }

      return await this.reportesSeguimientoService.generarReporteRetrasos(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de retrasos: ${error.message}`,
      );
    }
  }

  @Get('completitud')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de completitud con métricas de calidad',
    description:
      'Genera un reporte de completitud de seguimientos con análisis de calidad y métricas de progreso',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de completitud generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalSeguimientos: { type: 'number' },
        distribucionCompletitud: { type: 'object' },
        completitudPorAsignatura: { type: 'object' },
        completitudPorProfesor: { type: 'object' },
        completitudPorGrupo: { type: 'object' },
        metricasCalidad: { type: 'object' },
        seguimientos: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de filtro inválidos' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteCompletitud(
    @Query() filtros: FiltrosReporteCompletitudDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      // Los profesores solo pueden ver reportes de sus propias asignaturas
      if (
        req.user.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO ||
        req.user.rol === RolUsuario.PROFESOR_ASIGNATURA
      ) {
        filtros.profesorId = req.user.id;
      }

      return await this.reportesSeguimientoService.generarReporteCompletitud(
        filtros,
      );
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de completitud: ${error.message}`,
      );
    }
  }

  @Get('dashboard')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte consolidado para dashboard',
    description:
      'Genera un reporte consolidado con las métricas más importantes para el dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte de dashboard generado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al generar reporte de dashboard',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder al reporte',
  })
  async generarReporteDashboard(@Request() req: AuthenticatedRequest) {
    try {
      const filtrosBase = {
        cuatrimestreId: undefined,
        profesorId:
          req.user.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO ||
          req.user.rol === RolUsuario.PROFESOR_ASIGNATURA
            ? req.user.id
            : undefined,
        incluirDetalles: false,
      };

      const [
        reporteSeguimientos,
        reporteAvance,
        reporteRetrasos,
        reporteCompletitud,
      ] = await Promise.all([
        this.reportesSeguimientoService.generarReporteSeguimientos(filtrosBase),
        this.reportesSeguimientoService.generarReporteAvance(filtrosBase),
        this.reportesSeguimientoService.generarReporteRetrasos({
          ...filtrosBase,
          incluirJustificaciones: false,
          incluirAccionesCorrectivas: false,
        }),
        this.reportesSeguimientoService.generarReporteCompletitud({
          ...filtrosBase,
          incluirMetricasCalidad: false,
        }),
      ]);

      const dashboard = {
        resumen: {
          totalSeguimientos: reporteSeguimientos.totalSeguimientos,
          totalDetalles: reporteAvance.totalDetalles,
          totalRetrasos: reporteRetrasos.totalRetrasos,
          promedioCompletitud: this.calcularPromedioCompletitud(
            reporteCompletitud.seguimientos,
          ),
        },
        distribuciones: {
          estados: reporteSeguimientos.resumenPorEstado,
          avance: reporteAvance.resumenPorEstado,
          completitud: reporteCompletitud.distribucionCompletitud,
        },
        metricas: {
          retrasosPorSemana: reporteRetrasos.retrasosPorSemana,
          completitudPorAsignatura: reporteCompletitud.completitudPorAsignatura,
        },
        ultimaActualizacion: new Date().toISOString(),
      };

      return dashboard;
    } catch (error) {
      throw new BadRequestException(
        `Error al generar reporte de dashboard: ${error.message}`,
      );
    }
  }

  @Get('exportar/:tipo')
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Exportar reporte en diferentes formatos',
    description: 'Exporta el reporte especificado en formato CSV, Excel o PDF',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte exportado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Tipo de exportación no válido' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para exportar reportes',
  })
  async exportarReporte(
    @Query() filtros: FiltrosReporteSeguimientoDto,
    @Request() _req: AuthenticatedRequest,
  ) {
    try {
      // Por ahora retornamos un mensaje, pero aquí se implementaría la lógica de exportación
      const reporte =
        await this.reportesSeguimientoService.generarReporteSeguimientos(
          filtros,
        );

      return {
        mensaje: 'Funcionalidad de exportación en desarrollo',
        reporte,
        formato: 'json',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException(
        `Error al exportar reporte: ${error.message}`,
      );
    }
  }

  // Método privado para calcular promedio de completitud
  private calcularPromedioCompletitud(
    seguimientos: Array<{ porcentajeCompletitud?: string }>,
  ): number {
    if (seguimientos.length === 0) return 0;

    const totalCompletitud = seguimientos.reduce((sum, sc) => {
      return sum + parseFloat(sc.porcentajeCompletitud || '0');
    }, 0);

    return Math.round((totalCompletitud / seguimientos.length) * 100) / 100;
  }
}
