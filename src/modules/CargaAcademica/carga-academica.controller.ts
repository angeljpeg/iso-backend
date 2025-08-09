import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CargaAcademicaService } from './carga-academica.service';
import { CreateCargaAcademicaDto } from './dto/create-carga-academica.dto';
import { UpdateCargaAcademicaDto } from './dto/update-carga-academica.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('carga-academica')
@Controller('carga-academica')
export class CargaAcademicaController {
  constructor(private readonly cargaAcademicaService: CargaAcademicaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Crear nueva asignación de carga académica (solo coordinador)',
  })
  @ApiResponse({ status: 201, description: 'Asignación creada exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({
    status: 400,
    description:
      'Ya existe una asignación con la misma combinación o datos inválidos',
  })
  create(
    @Body() createCargaAcademicaDto: CreateCargaAcademicaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cargaAcademicaService.create(createCargaAcademicaDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener todas las asignaciones de carga académica',
  })
  @ApiQuery({
    name: 'profesorId',
    required: false,
    description: 'Filtrar por ID del profesor',
  })
  @ApiQuery({
    name: 'cuatrimestreId',
    required: false,
    description: 'Filtrar por ID del cuatrimestre',
  })
  @ApiQuery({
    name: 'grupoId',
    required: false,
    description: 'Filtrar por ID del grupo',
  })
  @ApiQuery({
    name: 'activo',
    required: false,
    type: Boolean,
    description:
      'Filtrar por estado activo/inactivo. Por defecto solo trae activos.',
  })
  @ApiQuery({
    name: 'actual',
    required: false,
    type: Boolean,
    description: 'Traer solo las asignaciones del cuatrimestre actual.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (opcional)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página (opcional, por defecto 10)',
  })
  @ApiQuery({
    name: 'carrera',
    required: false,
    description: 'Filtrar por carrera',
  })
  @ApiQuery({
    name: 'asignatura',
    required: false,
    description: 'Filtrar por asignatura',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de asignaciones de carga académica',
  })
  findAll(
    @Query('profesorId') profesorId?: string,
    @Query('cuatrimestreId') cuatrimestreId?: string,
    @Query('grupoId') grupoId?: string,
    @Query('carrera') carrera?: string,
    @Query('asignatura') asignatura?: string,
    @Query('activo') activo?: string,
    @Query('actual') actual?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.cargaAcademicaService.findAll(
      profesorId,
      cuatrimestreId,
      grupoId,
      carrera,
      asignatura,
      activo === undefined ? undefined : activo === 'true',
      actual === undefined ? undefined : actual === 'true',
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('profesor/:profesorId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener carga académica de un profesor específico',
  })
  @ApiQuery({
    name: 'actual',
    required: false,
    type: Boolean,
    description: 'Filtrar solo la carga académica del cuatrimestre actual',
  })
  @ApiResponse({ status: 200, description: 'Carga académica del profesor' })
  @ApiResponse({ status: 404, description: 'Profesor no encontrado' })
  findByProfesor(
    @Param('profesorId') profesorId: string,
    @Query('actual') actual?: string,
  ) {
    const actualBoolean = actual === 'true';
    return this.cargaAcademicaService.findByProfesor(profesorId, actualBoolean);
  }

  @Get('mi-carga')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener mi propia carga académica (solo profesores)',
  })
  @ApiQuery({
    name: 'actual',
    required: false,
    type: Boolean,
    description: 'Filtrar solo la carga académica del cuatrimestre actual',
  })
  @ApiResponse({ status: 200, description: 'Mi carga académica' })
  findMyCarga(
    @Request() req: AuthenticatedRequest,
    @Query('actual') actual?: string,
  ) {
    const actualBoolean = actual === 'true';
    return this.cargaAcademicaService.findByProfesor(
      req.user.id,
      actualBoolean,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener una asignación específica por ID' })
  @ApiResponse({ status: 200, description: 'Asignación encontrada' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.cargaAcademicaService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Actualizar asignación de carga académica (solo coordinador)',
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación actualizada exitosamente',
  })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateCargaAcademicaDto: UpdateCargaAcademicaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cargaAcademicaService.update(
      id,
      updateCargaAcademicaDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Eliminar asignación de carga académica (solo coordinador)',
  })
  @ApiResponse({
    status: 200,
    description: 'Asignación eliminada exitosamente',
  })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.cargaAcademicaService.remove(id, req.user);
  }
}
