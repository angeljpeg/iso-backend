import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@modules/Usuarios/entities/usuario.entity';
import {
  ReportesTutoriasService,
  ResumenGeneralTutorias,
  ReportePorVulnerabilidad,
  ReportePorAreaCanalizacion,
  ReportePorCarreraTutorias,
  ReportePorProfesorTutorias,
  TendenciaMensualTutorias,
} from './reportes-tutorias.service';

@ApiTags('Reportes - Tutorias')
@Controller('reportes/tutorias')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportesTutoriasController {
  constructor(private readonly reportesService: ReportesTutoriasService) {}

  @Get('resumen-general')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener resumen general de tutorias' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiQuery({ name: 'carrera', required: false, type: String })
  @ApiQuery({ name: 'profesorId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Resumen general generado exitosamente',
  })
  async getResumenGeneral(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('carrera') carrera?: string,
    @Query('profesorId') profesorId?: string,
  ): Promise<ResumenGeneralTutorias> {
    return await this.reportesService.getResumenGeneral(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      carrera,
      profesorId,
    );
  }

  @Get('por-vulnerabilidad')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener reporte por vulnerabilidad' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiQuery({ name: 'carrera', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reporte generado exitosamente' })
  async getReportePorVulnerabilidad(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('carrera') carrera?: string,
  ): Promise<ReportePorVulnerabilidad[]> {
    return await this.reportesService.getReportePorVulnerabilidad(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      carrera,
    );
  }

  @Get('por-area')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener reporte por área de canalización' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiQuery({ name: 'carrera', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reporte generado exitosamente' })
  async getReportePorArea(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('carrera') carrera?: string,
  ): Promise<ReportePorAreaCanalizacion[]> {
    return await this.reportesService.getReportePorArea(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      carrera,
    );
  }

  @Get('por-carrera')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener reporte de tutorias por carrera' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Reporte generado exitosamente' })
  async getReportePorCarrera(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ): Promise<ReportePorCarreraTutorias[]> {
    return await this.reportesService.getReportePorCarrera(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
    );
  }

  @Get('por-profesor')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener reporte de tutorias por profesor' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiQuery({ name: 'profesorId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Reporte generado exitosamente' })
  async getReportePorProfesor(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('profesorId') profesorId?: string,
  ): Promise<ReportePorProfesorTutorias[]> {
    return await this.reportesService.getReportePorProfesor(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      profesorId,
    );
  }

  @Get('tendencias-mensuales')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Obtener tendencias mensuales de tutorias' })
  @ApiQuery({ name: 'anio', required: false, type: Number })
  @ApiQuery({ name: 'carrera', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Tendencias generadas exitosamente',
  })
  async getTendenciasMensuales(
    @Query('anio') anio?: number,
    @Query('carrera') carrera?: string,
  ): Promise<TendenciaMensualTutorias[]> {
    return await this.reportesService.getTendenciasMensuales(
      anio || new Date().getFullYear(),
      carrera,
    );
  }

  @Get('exportar-excel')
  @Roles(RolUsuario.COORDINADOR)
  @ApiOperation({ summary: 'Exportar reporte completo a Excel' })
  @ApiQuery({ name: 'fechaDesde', required: false, type: Date })
  @ApiQuery({ name: 'fechaHasta', required: false, type: Date })
  @ApiQuery({ name: 'carrera', required: false, type: String })
  @ApiQuery({ name: 'profesorId', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado exitosamente',
  })
  async exportarExcel(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('carrera') carrera?: string,
    @Query('profesorId') profesorId?: string,
  ): Promise<any> {
    return await this.reportesService.exportarExcel(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      carrera,
      profesorId,
    );
  }
}
