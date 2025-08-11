import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { TutoriasService } from './tutorias.service';
import { TutoriaDetallesService } from './tutoria-detalles.service';
import {
  CreateTutoriaDto,
  UpdateTutoriaDto,
  QueryTutoriaDto,
  CreateTutoriaDetalleDto,
  UpdateTutoriaDetalleDto,
} from './dto';
import { Tutoria, TutoriaDetalle, EstadoRevision } from './entities';

@ApiTags('Tutorias')
@Controller('tutorias')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt-auth')
export class TutoriasController {
  constructor(
    private readonly tutoriasService: TutoriasService,
    private readonly tutoriaDetallesService: TutoriaDetallesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tutoria' })
  @ApiResponse({
    status: 201,
    description: 'Tutoria creada exitosamente',
    type: Tutoria,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createTutoriaDto: CreateTutoriaDto): Promise<Tutoria> {
    return this.tutoriasService.create(createTutoriaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las tutorias con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tutorias obtenida exitosamente',
    type: [Tutoria],
  })
  @ApiQuery({ name: 'cuatrimestre', required: false })
  @ApiQuery({ name: 'nombreTutor', required: false })
  @ApiQuery({ name: 'grupo', required: false })
  @ApiQuery({ name: 'carrera', required: false })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'estadoRevision', required: false })
  @ApiQuery({ name: 'cargaAcademicaId', required: false })
  findAll(@Query() queryDto: QueryTutoriaDto): Promise<Tutoria[]> {
    return this.tutoriasService.findAll(queryDto);
  }

  @Get('profesor/:nombreTutor')
  @ApiOperation({ summary: 'Obtener tutorias por nombre del profesor' })
  @ApiParam({ name: 'nombreTutor', description: 'Nombre del profesor' })
  @ApiResponse({
    status: 200,
    description: 'Tutorias del profesor obtenidas exitosamente',
    type: [Tutoria],
  })
  findByProfesor(
    @Param('nombreTutor') nombreTutor: string,
  ): Promise<Tutoria[]> {
    return this.tutoriasService.getTutoriasByProfesor(nombreTutor);
  }

  @Get('carrera/:carrera')
  @ApiOperation({ summary: 'Obtener tutorias por carrera' })
  @ApiParam({ name: 'carrera', description: 'Nombre de la carrera' })
  @ApiResponse({
    status: 200,
    description: 'Tutorias de la carrera obtenidas exitosamente',
    type: [Tutoria],
  })
  findByCarrera(@Param('carrera') carrera: string): Promise<Tutoria[]> {
    return this.tutoriasService.getTutoriasByCarrera(carrera);
  }

  @Get('cuatrimestre/:cuatrimestre')
  @ApiOperation({ summary: 'Obtener tutorias por cuatrimestre' })
  @ApiParam({ name: 'cuatrimestre', description: 'Nombre del cuatrimestre' })
  @ApiResponse({
    status: 200,
    description: 'Tutorias del cuatrimestre obtenidas exitosamente',
    type: [Tutoria],
  })
  findByCuatrimestre(
    @Param('cuatrimestre') cuatrimestre: string,
  ): Promise<Tutoria[]> {
    return this.tutoriasService.getTutoriasByCuatrimestre(cuatrimestre);
  }

  @Get('carga-academica/:cargaAcademicaId')
  @ApiOperation({ summary: 'Obtener tutorias por carga académica' })
  @ApiParam({
    name: 'cargaAcademicaId',
    description: 'ID de la carga académica',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-carga-academica',
  })
  @ApiResponse({
    status: 200,
    description: 'Tutorias de la carga académica obtenidas exitosamente',
    type: [Tutoria],
  })
  findByCargaAcademica(
    @Param('cargaAcademicaId') cargaAcademicaId: string,
  ): Promise<Tutoria[]> {
    return this.tutoriasService.findByCargaAcademica(cargaAcademicaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tutoria por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Tutoria obtenida exitosamente',
    type: Tutoria,
  })
  @ApiResponse({ status: 404, description: 'Tutoria no encontrada' })
  findOne(@Param('id') id: string): Promise<Tutoria> {
    return this.tutoriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tutoria' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Tutoria actualizada exitosamente',
    type: Tutoria,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Tutoria no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateTutoriaDto: UpdateTutoriaDto,
  ): Promise<Tutoria> {
    return this.tutoriasService.update(id, updateTutoriaDto);
  }

  @Patch(':id/estado-revision')
  @ApiOperation({ summary: 'Actualizar estado de revisión de una tutoria' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de revisión actualizado exitosamente',
    type: Tutoria,
  })
  @ApiResponse({ status: 400, description: 'Transición de estado inválida' })
  @ApiResponse({ status: 404, description: 'Tutoria no encontrada' })
  updateEstadoRevision(
    @Param('id') id: string,
    @Body('estadoRevision') estadoRevision: EstadoRevision,
  ): Promise<Tutoria> {
    return this.tutoriasService.updateEstadoRevision(id, estadoRevision);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tutoria' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({ status: 200, description: 'Tutoria eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Tutoria no encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tutoriasService.remove(id);
  }

  // Endpoints para detalles de tutoria
  @Post(':id/detalles')
  @ApiOperation({ summary: 'Crear un detalle de tutoria' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({
    status: 201,
    description: 'Detalle de tutoria creado exitosamente',
    type: TutoriaDetalle,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  createDetalle(
    @Param('id') tutoriaId: string,
    @Body() createDetalleDto: CreateTutoriaDetalleDto,
  ): Promise<TutoriaDetalle> {
    return this.tutoriaDetallesService.create({
      ...createDetalleDto,
      tutoriaId,
    });
  }

  @Get(':id/detalles')
  @ApiOperation({ summary: 'Obtener detalles de una tutoria' })
  @ApiParam({
    name: 'id',
    description: 'ID de la tutoria',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-tutoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la tutoria obtenidos exitosamente',
    type: [TutoriaDetalle],
  })
  getDetalles(@Param('id') tutoriaId: string): Promise<TutoriaDetalle[]> {
    return this.tutoriaDetallesService.findByTutoria(tutoriaId);
  }

  @Get('detalles/:detalleId')
  @ApiOperation({ summary: 'Obtener un detalle de tutoria por ID' })
  @ApiParam({
    name: 'detalleId',
    description: 'ID del detalle',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-detalle',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de tutoria obtenido exitosamente',
    type: TutoriaDetalle,
  })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  getDetalle(@Param('detalleId') detalleId: string): Promise<TutoriaDetalle> {
    return this.tutoriaDetallesService.findOne(detalleId);
  }

  @Patch('detalles/:detalleId')
  @ApiOperation({ summary: 'Actualizar un detalle de tutoria' })
  @ApiParam({
    name: 'detalleId',
    description: 'ID del detalle',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-detalle',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de tutoria actualizado exitosamente',
    type: TutoriaDetalle,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  updateDetalle(
    @Param('detalleId') detalleId: string,
    @Body() updateDetalleDto: UpdateTutoriaDetalleDto,
  ): Promise<TutoriaDetalle> {
    return this.tutoriaDetallesService.update(detalleId, updateDetalleDto);
  }

  @Delete('detalles/:detalleId')
  @ApiOperation({ summary: 'Eliminar un detalle de tutoria' })
  @ApiParam({
    name: 'detalleId',
    description: 'ID del detalle',
    type: 'string',
    format: 'uuid',
    example: 'uuid-de-detalle',
  })
  @ApiResponse({ status: 200, description: 'Detalle eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  removeDetalle(@Param('detalleId') detalleId: string): Promise<void> {
    return this.tutoriaDetallesService.remove(detalleId);
  }

  // Endpoints para estadísticas
  @Get('estadisticas/vulnerabilidad')
  @ApiOperation({ summary: 'Obtener estadísticas por tipo de vulnerabilidad' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getEstadisticasVulnerabilidad() {
    return this.tutoriaDetallesService.getEstadisticasVulnerabilidad();
  }

  @Get('estadisticas/area-canalizacion')
  @ApiOperation({ summary: 'Obtener estadísticas por área de canalización' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getEstadisticasAreaCanalizacion() {
    return this.tutoriaDetallesService.getEstadisticasAreaCanalizacion();
  }
}
