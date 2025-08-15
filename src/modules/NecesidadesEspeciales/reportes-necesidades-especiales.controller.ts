import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  ReportesNecesidadesEspecialesService,
  ResumenGeneral,
  ReportePorTipoNecesidad,
  ReportePorCarrera,
  ReportePorProfesor,
  TendenciaMensual,
} from './reportes-necesidades-especiales.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@modules/Usuarios/entities/usuario.entity';

@ApiTags('Reportes - Necesidades Especiales')
@Controller('reportes/necesidades-especiales')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportesNecesidadesEspecialesController {
  constructor(
    private readonly reportesService: ReportesNecesidadesEspecialesService,
  ) {}

  @Get('resumen-general')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Obtener resumen general de necesidades especiales',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha de inicio para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha de fin para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'programaEducativo',
    required: false,
    description: 'Filtrar por programa educativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen general generado exitosamente',
  })
  async getResumenGeneral(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('programaEducativo') programaEducativo?: string,
  ): Promise<ResumenGeneral> {
    return await this.reportesService.getResumenGeneral(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      programaEducativo,
    );
  }

  @Get('por-tipo-necesidad')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Obtener reporte por tipo de necesidad especial',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha de inicio para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha de fin para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'programaEducativo',
    required: false,
    description: 'Filtrar por programa educativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte por tipo de necesidad generado exitosamente',
  })
  async getReportePorTipoNecesidad(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('programaEducativo') programaEducativo?: string,
  ): Promise<ReportePorTipoNecesidad[]> {
    return await this.reportesService.getReportePorTipoNecesidad(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      programaEducativo,
    );
  }

  @Get('por-carrera')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Obtener reporte de necesidades especiales por carrera',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha de inicio para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha de fin para el reporte',
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte por carrera generado exitosamente',
  })
  async getReportePorCarrera(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ): Promise<ReportePorCarrera[]> {
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
  @ApiOperation({
    summary: 'Obtener reporte de necesidades especiales por profesor',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha de inicio para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha de fin para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'profesorId',
    required: false,
    description: 'ID específico del profesor',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte por profesor generado exitosamente',
  })
  async getReportePorProfesor(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('profesorId') profesorId?: string,
  ): Promise<ReportePorProfesor[]> {
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
  @ApiOperation({
    summary: 'Obtener tendencias mensuales de necesidades especiales',
  })
  @ApiQuery({
    name: 'anio',
    required: false,
    description: 'Año para el reporte (por defecto año actual)',
    type: Number,
  })
  @ApiQuery({
    name: 'programaEducativo',
    required: false,
    description: 'Filtrar por programa educativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Tendencias mensuales generadas exitosamente',
  })
  async getTendenciasMensuales(
    @Query('anio') anio?: number,
    @Query('programaEducativo') programaEducativo?: string,
  ): Promise<TendenciaMensual[]> {
    return await this.reportesService.getTendenciasMensuales(
      anio || new Date().getFullYear(),
      programaEducativo,
    );
  }

  @Get('exportar-excel')
  @Roles(RolUsuario.COORDINADOR)
  @ApiOperation({
    summary: 'Exportar reporte completo a Excel',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Fecha de inicio para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Fecha de fin para el reporte',
    type: Date,
  })
  @ApiQuery({
    name: 'programaEducativo',
    required: false,
    description: 'Filtrar por programa educativo',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado exitosamente',
  })
  async exportarExcel(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('programaEducativo') programaEducativo?: string,
  ): Promise<any> {
    return await this.reportesService.exportarExcel(
      fechaDesde ? new Date(fechaDesde) : undefined,
      fechaHasta ? new Date(fechaHasta) : undefined,
      programaEducativo,
    );
  }
}
