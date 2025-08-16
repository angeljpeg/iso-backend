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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EstadiasService } from './estadias.service';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';
import { CreateEstadiaAlumnoDto } from './dto/create-estadia-alumno.dto';
import { UpdateEstadiaAlumnoDto } from './dto/update-estadia-alumno.dto';
import { CreateProgresoMensualDto } from './dto/create-progreso-mensual.dto';
import { UpdateProgresoMensualDto } from './dto/update-progreso-mensual.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '../../common/interfaces/auth-request.interface';

@ApiTags('estadias')
@Controller('estadias')
export class EstadiasController {
  constructor(private readonly estadiasService: EstadiasService) {}

  // Endpoint de prueba sin guards
  @Get('test')
  @ApiOperation({
    summary: 'Endpoint de prueba',
    description:
      'Endpoint para verificar que el controlador de estadías esté funcionando correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Controlador funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Estadias controller working' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  test() {
    console.log('🧪 Test endpoint called - no guards');
    return { message: 'Estadias controller working', timestamp: new Date() };
  }

  // Rutas para Estadías
  @Post()
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Crear nueva estadía',
    description:
      'Permite a los profesores crear una nueva estadía. El profesorId se asigna automáticamente del usuario autenticado.',
  })
  @ApiBody({ type: CreateEstadiaDto })
  @ApiResponse({
    status: 201,
    description: 'Estadía creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        profesorId: { type: 'string', format: 'uuid' },
        periodo: { type: 'string', example: '2024-1' },
        observacionesGenerales: { type: 'string' },
        activo: { type: 'boolean', default: true },
        profesor: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nombre: { type: 'string' },
            apellido: { type: 'string' },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Rol insuficiente',
  })
  create(@Body() createEstadiaDto: CreateEstadiaDto) {
    // Asignar automáticamente el profesorId del usuario autenticado
    return this.estadiasService.create(createEstadiaDto);
  }

  @Get()
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Obtener todas las estadías',
    description:
      'Permite a coordinadores y moderadores obtener todas las estadías activas del sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estadías obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },

          profesorId: { type: 'string', format: 'uuid' },
          periodo: { type: 'string', example: '2024-1' },
          observacionesGenerales: { type: 'string' },
          activo: { type: 'boolean' },
          profesor: { type: 'object' },
          alumnos: { type: 'array' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Rol insuficiente',
  })
  findAll(@Request() req: AuthenticatedRequest) {
    console.log('🔍 Usuario en findAll estadías:', req.user);
    return this.estadiasService.findAll();
  }

  @Get('profesor')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  @ApiOperation({
    summary: 'Obtener estadías del profesor autenticado',
    description:
      'Permite a los profesores obtener sus propias estadías. Se obtienen automáticamente basado en el usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estadías del profesor obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },

          profesorId: { type: 'string', format: 'uuid' },
          periodo: { type: 'string', example: '2024-1' },
          observacionesGenerales: { type: 'string' },
          activo: { type: 'boolean' },
          profesor: { type: 'object' },
          alumnos: { type: 'array' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - Rol insuficiente',
  })
  findByProfesor(@Request() req: AuthenticatedRequest) {
    console.log('🔍 Usuario en findByProfesor estadías:', req.user);
    return this.estadiasService.findByProfesor(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Obtener estadía por ID',
    description:
      'Obtiene una estadía específica con todos sus alumnos y progreso mensual.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la estadía', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estadía encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findOne(@Param('id') id: string) {
    return this.estadiasService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiOperation({
    summary: 'Actualizar estadía',
    description: 'Permite a los profesores actualizar una estadía existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la estadía a actualizar',
    type: 'string',
  })
  @ApiBody({ type: UpdateEstadiaDto })
  @ApiResponse({ status: 200, description: 'Estadía actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  update(@Param('id') id: string, @Body() updateEstadiaDto: UpdateEstadiaDto) {
    return this.estadiasService.update(id, updateEstadiaDto);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiOperation({
    summary: 'Eliminar estadía',
    description: 'Elimina una estadía (soft delete)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la estadía', type: 'string' })
  @ApiResponse({ status: 200, description: 'Estadía eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
  remove(@Param('id') id: string) {
    return this.estadiasService.remove(id);
  }

  // Rutas para Alumnos de Estadía
  @Post('alumnos')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Agregar alumno a estadía',
    description:
      'Permite a los profesores agregar un nuevo alumno a una estadía.',
  })
  @ApiBody({ type: CreateEstadiaAlumnoDto })
  @ApiResponse({ status: 201, description: 'Alumno agregado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  createAlumno(@Body() createEstadiaAlumnoDto: CreateEstadiaAlumnoDto) {
    return this.estadiasService.createAlumno(createEstadiaAlumnoDto);
  }

  @Get('alumnos/all')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({
    summary: 'Obtener todos los alumnos',
    description: 'Obtiene todos los alumnos de todas las estadías.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de alumnos obtenida exitosamente',
  })
  findAllAlumnos() {
    return this.estadiasService.findAllAlumnos();
  }

  @Get('alumnos/estadia/:estadiaId')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Obtener alumnos por estadía',
    description: 'Obtiene todos los alumnos de una estadía específica.',
  })
  @ApiParam({
    name: 'estadiaId',
    description: 'UUID de la estadía',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de alumnos obtenida exitosamente',
  })
  findAlumnosByEstadia(@Param('estadiaId') estadiaId: string) {
    return this.estadiasService.findAlumnosByEstadia(estadiaId);
  }

  @Get('alumnos/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  findAlumno(@Param('id') id: string) {
    return this.estadiasService.findAlumno(id);
  }

  @Patch('alumnos/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  updateAlumno(
    @Param('id') id: string,
    @Body() updateEstadiaAlumnoDto: UpdateEstadiaAlumnoDto,
  ) {
    return this.estadiasService.updateAlumno(id, updateEstadiaAlumnoDto);
  }

  @Delete('alumnos/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  removeAlumno(@Param('id') id: string) {
    return this.estadiasService.removeAlumno(id);
  }

  @Patch('alumnos/:id/restore')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR, RolUsuario.MODERADOR)
  @ApiOperation({ summary: 'Restaurar alumno inactivo' })
  @ApiParam({ name: 'id', description: 'UUID del alumno', type: 'string' })
  @ApiResponse({ status: 200, description: 'Alumno restaurado exitosamente' })
  restoreAlumno(@Param('id') id: string) {
    return this.estadiasService.restoreAlumno(id);
  }

  // Rutas para Progreso Mensual
  @Post('progreso')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  @ApiOperation({
    summary: 'Registrar progreso mensual',
    description:
      'Permite a los profesores registrar el progreso mensual de un alumno.',
  })
  @ApiBody({ type: CreateProgresoMensualDto })
  @ApiResponse({ status: 201, description: 'Progreso registrado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe progreso para este alumno en este mes',
  })
  createProgreso(@Body() createProgresoMensualDto: CreateProgresoMensualDto) {
    return this.estadiasService.createProgreso(createProgresoMensualDto);
  }

  @Get('progreso/alumno/:estadiaAlumnoId')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  findProgresoByAlumno(@Param('estadiaAlumnoId') estadiaAlumnoId: string) {
    return this.estadiasService.findProgresoByAlumno(estadiaAlumnoId);
  }

  @Get('progreso/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  findProgreso(@Param('id') id: string) {
    return this.estadiasService.findProgreso(id);
  }

  @Patch('progreso/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  updateProgreso(
    @Param('id') id: string,
    @Body() updateProgresoMensualDto: UpdateProgresoMensualDto,
  ) {
    return this.estadiasService.updateProgreso(id, updateProgresoMensualDto);
  }

  @Delete('progreso/:id')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  removeProgreso(@Param('id') id: string) {
    return this.estadiasService.removeProgreso(id);
  }

  // Ruta para obtener reporte completo
  @Get('reporte/:estadiaId')
  @ApiBearerAuth('jwt-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.MODERADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiOperation({
    summary: 'Obtener reporte completo de estadía',
    description:
      'Genera un reporte completo de una estadía incluyendo todos los alumnos y su progreso mensual. Ideal para evaluaciones y seguimiento.',
  })
  @ApiParam({
    name: 'estadiaId',
    description: 'UUID de la estadía para generar el reporte',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Reporte generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        periodo: { type: 'string' },
        profesor: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            email: { type: 'string' },
          },
        },
        alumnos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nombreAlumno: { type: 'string' },
              matricula: { type: 'string' },
              carrera: { type: 'string' },
              progresoMensual: { type: 'array' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Estadía no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  getReporteEstadia(@Param('estadiaId') estadiaId: string) {
    return this.estadiasService.getReporteEstadia(estadiaId);
  }
}
