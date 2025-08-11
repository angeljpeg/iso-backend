import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@modules/Usuarios/entities/usuario.entity';
import { ReportesAsesoriasService } from './reportes-asesorias.service';
import {
  FiltrosReporteAsesoriasDto,
  FiltrosReporteAsesoriasPorCarreraDto,
  FiltrosReporteAsesoriasPorProfesorDto,
  FiltrosReporteAsesoriasPorTemaDto,
  FiltrosReporteEstadisticasAsesoriasDto,
} from './dto/reportes-asesorias.dto';

@ApiTags('reportes-asesorias')
@Controller('reportes-asesorias')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('jwt-auth')
export class ReportesAsesoriasController {
  constructor(
    private readonly reportesAsesoriasService: ReportesAsesoriasService,
  ) {}

  @Get('general')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte general de asesorías',
    description:
      'Genera un reporte general de asesorías con filtros avanzados incluyendo métricas por carrera, cuatrimestre, profesor, tema y grupo.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        resumenPorCarrera: { type: 'object' },
        resumenPorCuatrimestre: { type: 'object' },
        resumenPorProfesor: { type: 'object' },
        resumenPorTema: { type: 'object' },
        resumenPorGrupo: { type: 'object' },
        totalAlumnosAtendidos: { type: 'number' },
        totalHorasAsesorias: { type: 'number' },
        asesorias: { type: 'array' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los filtros',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReporteGeneral(@Query() filtros: FiltrosReporteAsesoriasDto) {
    return this.reportesAsesoriasService.generarReporteAsesorias(filtros);
  }

  @Get('por-carrera')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de asesorías por carrera',
    description:
      'Genera un reporte detallado de asesorías agrupadas por carrera con métricas específicas de cada carrera.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte por carrera generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        resumenPorCarrera: { type: 'object' },
        metricasGenerales: {
          type: 'object',
          properties: {
            totalAlumnosAtendidos: { type: 'number' },
            totalHorasAsesorias: { type: 'number' },
            promedioAlumnosPorAsesoria: { type: 'string' },
            promedioDuracionPorAsesoria: { type: 'string' },
          },
        },
        asesorias: { type: 'array' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los filtros',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReportePorCarrera(
    @Query() filtros: FiltrosReporteAsesoriasPorCarreraDto,
  ) {
    return this.reportesAsesoriasService.generarReporteAsesoriasPorCarrera(
      filtros,
    );
  }

  @Get('por-profesor')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de asesorías por profesor',
    description:
      'Genera un reporte detallado de asesorías agrupadas por profesor con métricas específicas de cada profesor.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte por profesor generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        resumenPorProfesor: { type: 'object' },
        metricasGenerales: {
          type: 'object',
          properties: {
            totalAlumnosAtendidos: { type: 'number' },
            totalHorasAsesorias: { type: 'number' },
            promedioAsesoriasPorProfesor: { type: 'string' },
          },
        },
        asesorias: { type: 'array' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los filtros',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReportePorProfesor(
    @Query() filtros: FiltrosReporteAsesoriasPorProfesorDto,
  ) {
    return this.reportesAsesoriasService.generarReporteAsesoriasPorProfesor(
      filtros,
    );
  }

  @Get('por-tema')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de asesorías por tema',
    description:
      'Genera un reporte detallado de asesorías agrupadas por tema con métricas específicas de cada tema.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte por tema generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        resumenPorTema: { type: 'object' },
        metricasGenerales: {
          type: 'object',
          properties: {
            totalAlumnosAtendidos: { type: 'number' },
            totalHorasAsesorias: { type: 'number' },
            temasUnicos: { type: 'number' },
          },
        },
        asesorias: { type: 'array' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los filtros',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReportePorTema(@Query() filtros: FiltrosReporteAsesoriasPorTemaDto) {
    return this.reportesAsesoriasService.generarReporteAsesoriasPorTema(
      filtros,
    );
  }

  @Get('estadisticas')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte estadístico de asesorías',
    description:
      'Genera un reporte estadístico completo de asesorías con métricas agregadas y distribuciones por diferentes criterios.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte estadístico generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        totalAlumnosAtendidos: { type: 'number' },
        totalHorasAsesorias: { type: 'number' },
        promedioAlumnosPorAsesoria: { type: 'string' },
        promedioDuracionPorAsesoria: { type: 'string' },
        distribucionPorCarrera: { type: 'object' },
        distribucionPorCuatrimestre: { type: 'object' },
        distribucionPorProfesor: { type: 'object' },
        distribucionPorTema: { type: 'object' },
        distribucionPorGrupo: { type: 'object' },
        agrupaciones: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los filtros',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReporteEstadisticas(
    @Query() filtros: FiltrosReporteEstadisticasAsesoriasDto,
  ) {
    return this.reportesAsesoriasService.generarReporteEstadisticas(filtros);
  }

  @Get('dashboard')
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Generar reporte de dashboard de asesorías',
    description:
      'Genera un reporte consolidado para dashboard con las métricas más importantes de asesorías.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte de dashboard generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        totalAsesorias: { type: 'number' },
        totalAlumnosAtendidos: { type: 'number' },
        totalHorasAsesorias: { type: 'number' },
        promedioAlumnosPorAsesoria: { type: 'string' },
        promedioDuracionPorAsesoria: { type: 'string' },
        topCarreras: { type: 'array' },
        topProfesores: { type: 'array' },
        topTemas: { type: 'array' },
        distribucionPorCuatrimestre: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Acceso denegado' })
  generarReporteDashboard() {
    // Para el dashboard, usamos filtros básicos
    const filtros: FiltrosReporteEstadisticasAsesoriasDto = {
      agruparPorCarrera: true,
      agruparPorProfesor: true,
      agruparPorAsignatura: true,
      incluirMetricasAlumnos: true,
    };

    return this.reportesAsesoriasService.generarReporteEstadisticas(filtros);
  }
}
