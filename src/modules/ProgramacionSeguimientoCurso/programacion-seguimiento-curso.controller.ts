import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProgramacionSeguimientoCursoService } from './programacion-seguimiento-curso.service';
import { CreateSeguimientoCursoDto } from './dto/create-seguimiento-curso.dto';
import { UpdateSeguimientoCursoDto } from './dto/update-seguimiento-curso.dto';
import { CreateSeguimientoDetalleDto } from './dto/create-seguimiento-detalle.dto';
import { UpdateSeguimientoDetalleDto } from './dto/update-seguimiento-detalle.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';
import { EstadoSeguimiento } from './entities/seguimiento-curso.entity';

@ApiTags('programacion-seguimiento-curso')
@Controller('programacion-seguimiento-curso')
export class ProgramacionSeguimientoCursoController {
  constructor(
    private readonly programacionSeguimientoCursoService: ProgramacionSeguimientoCursoService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Crear nuevo seguimiento de curso' })
  @ApiResponse({ status: 201, description: 'Seguimiento creado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o seguimiento ya existe',
  })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(
    @Body() createSeguimientoCursoDto: CreateSeguimientoCursoDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.programacionSeguimientoCursoService.create(
      createSeguimientoCursoDto,
      req.user,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todos los seguimientos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cuatrimestreId', required: false, type: String })
  @ApiQuery({ name: 'profesorId', required: false, type: String })
  @ApiQuery({ name: 'estado', required: false, enum: EstadoSeguimiento })
  @ApiQuery({ name: 'semana', required: false, type: Number })
  @ApiQuery({ name: 'conRetrasos', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de seguimientos' })
  findAll() {
    return this.programacionSeguimientoCursoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener seguimiento por ID' })
  @ApiResponse({ status: 200, description: 'Seguimiento encontrado' })
  @ApiResponse({ status: 404, description: 'Seguimiento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.programacionSeguimientoCursoService.findOne(id);
  }

  @Get('cargaAcademica/:cargaAcademicaId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiParam({ name: 'cargaAcademicaId', required: true, type: String })
  findOneByCargaAcademicaId(
    @Param('cargaAcademicaId') cargaAcademicaId: string,
  ) {
    return this.programacionSeguimientoCursoService.findOneByCargaAcademicaId(
      cargaAcademicaId,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar seguimiento' })
  @ApiResponse({ status: 200, description: 'Seguimiento actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Seguimiento no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateSeguimientoCursoDto: UpdateSeguimientoCursoDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.programacionSeguimientoCursoService.update(
      id,
      updateSeguimientoCursoDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Eliminar seguimiento' })
  @ApiResponse({
    status: 200,
    description: 'Seguimiento eliminado exitosamente',
  })
  @ApiResponse({ status: 403, description: 'Sin permisos para eliminar' })
  @ApiResponse({ status: 404, description: 'Seguimiento no encontrado' })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.programacionSeguimientoCursoService.remove(id, req.user);
  }

  // === ENDPOINTS PARA DETALLES ===

  @Post(':seguimientoId/detalles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Crear detalle de seguimiento' })
  @ApiResponse({ status: 201, description: 'Detalle creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Seguimiento no encontrado' })
  createDetalle(
    @Param('seguimientoId') seguimientoId: string,
    @Body() createDetalleDto: CreateSeguimientoDetalleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.programacionSeguimientoCursoService.createDetalle(
      seguimientoId,
      createDetalleDto,
      req.user,
    );
  }

  @Get(':seguimientoId/detalles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener detalles de un seguimiento' })
  @ApiResponse({ status: 200, description: 'Lista de detalles' })
  @ApiResponse({ status: 404, description: 'Seguimiento no encontrado' })
  findDetalles(@Param('seguimientoId') seguimientoId: string) {
    return this.programacionSeguimientoCursoService.findDetalles(seguimientoId);
  }

  @Patch(':seguimientoId/detalles/:detalleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar detalle de seguimiento' })
  @ApiResponse({ status: 200, description: 'Detalle actualizado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  updateDetalle(
    @Param('seguimientoId') seguimientoId: string,
    @Param('detalleId') detalleId: string,
    @Body() updateDetalleDto: UpdateSeguimientoDetalleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.programacionSeguimientoCursoService.updateDetalle(
      seguimientoId,
      detalleId,
      updateDetalleDto,
      req.user,
    );
  }

  @Delete(':seguimientoId/detalles/:detalleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Eliminar detalle de seguimiento' })
  @ApiResponse({ status: 200, description: 'Detalle eliminado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos para eliminar' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  removeDetalle(
    @Param('seguimientoId') seguimientoId: string,
    @Param('detalleId') detalleId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.programacionSeguimientoCursoService.removeDetalle(
      seguimientoId,
      detalleId,
      req.user,
    );
  }
}
