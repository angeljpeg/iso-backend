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
  ApiParam,
} from '@nestjs/swagger';
import { AsesoriasService } from './asesorias.service';
import { CreateAsesoriaDto } from './dto/create-asesoria.dto';
import { UpdateAsesoriaDto } from './dto/update-asesoria.dto';
import { AsesoriaResponseDto } from './dto/asesoria-response.dto';
import { Asesoria } from './entities/asesoria.entity';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('asesorias')
@Controller('asesorias')
export class AsesoriasController {
  constructor(private readonly asesoriasService: AsesoriasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PROFESOR_TIEMPO_COMPLETO, RolUsuario.PROFESOR_ASIGNATURA)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Crear nueva asesoría',
    description:
      'Crea una nueva asesoría. Solo los profesores pueden crear asesorías.',
  })
  @ApiResponse({
    status: 201,
    description: 'Asesoría creada exitosamente',
    type: Asesoria,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o asesoría duplicada',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos - Solo profesores pueden crear asesorías',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  create(@Body() createAsesoriaDto: CreateAsesoriaDto): Promise<Asesoria> {
    return this.asesoriasService.create(createAsesoriaDto);
  }

  @Get('test-relations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Probar relaciones (temporal)',
    description:
      'Endpoint temporal para probar que las relaciones funcionen correctamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Prueba de relaciones completada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  testRelations(): Promise<any> {
    return this.asesoriasService.testRelations();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener todas las asesorías con filtros y paginación',
    description:
      'Retorna una lista paginada de asesorías con opciones de filtrado avanzado.',
  })
  @ApiQuery({
    name: 'profesorNombre',
    required: false,
    description: 'Filtrar por nombre del profesor',
    example: 'Juan',
  })
  @ApiQuery({
    name: 'cuatrimestreNombre',
    required: false,
    description: 'Filtrar por nombre del cuatrimestre',
    example: '2024-1',
  })
  @ApiQuery({
    name: 'grupoNombre',
    required: false,
    description: 'Filtrar por nombre del grupo',
    example: 'A',
  })
  @ApiQuery({
    name: 'temaNombre',
    required: false,
    description: 'Filtrar por nombre del tema de asesoría',
    example: 'Cálculo diferencial',
  })
  @ApiQuery({
    name: 'asignaturaNombre',
    required: false,
    description: 'Filtrar por nombre de la asignatura',
    example: 'Matemáticas',
  })
  @ApiQuery({
    name: 'carreraNombre',
    required: false,
    description: 'Filtrar por nombre de la carrera',
    example: 'Ingeniería en Sistemas',
  })
  @ApiQuery({
    name: 'cuatrimestreActual',
    required: false,
    type: Boolean,
    description: 'Filtrar solo por cuatrimestre actual',
    example: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página (por defecto 10, máximo 100)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de asesorías obtenida exitosamente',
    type: AsesoriaResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findAll(
    @Query('profesorNombre') profesorNombre?: string,
    @Query('cuatrimestreNombre') cuatrimestreNombre?: string,
    @Query('grupoNombre') grupoNombre?: string,
    @Query('temaNombre') temaNombre?: string,
    @Query('asignaturaNombre') asignaturaNombre?: string,
    @Query('carreraNombre') carreraNombre?: string,
    @Query('cuatrimestreActual') cuatrimestreActual?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<AsesoriaResponseDto> {
    return this.asesoriasService.findAll(
      profesorNombre,
      cuatrimestreNombre,
      grupoNombre,
      temaNombre,
      asignaturaNombre,
      carreraNombre,
      cuatrimestreActual === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('carga-academica/:cargaAcademicaId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener asesorías por ID de carga académica',
    description:
      'Retorna todas las asesorías asociadas a una carga académica específica.',
  })
  @ApiParam({
    name: 'cargaAcademicaId',
    description: 'ID de la carga académica',
    example: 'uuid-de-carga-academica',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de asesorías obtenida exitosamente',
    type: [Asesoria],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findByCargaAcademicaId(
    @Param('cargaAcademicaId') cargaAcademicaId: string,
  ): Promise<Asesoria[]> {
    return this.asesoriasService.findByCargaAcademicaId(cargaAcademicaId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Obtener asesoría por ID',
    description: 'Retorna una asesoría específica por su ID único.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la asesoría',
    example: 'uuid-de-asesoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Asesoría obtenida exitosamente',
    type: Asesoria,
  })
  @ApiResponse({
    status: 404,
    description: 'Asesoría no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  findOne(@Param('id') id: string): Promise<Asesoria> {
    return this.asesoriasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Actualizar asesoría',
    description:
      'Actualiza una asesoría existente. Solo los profesores pueden actualizar asesorías.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la asesoría a actualizar',
    example: 'uuid-de-asesoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Asesoría actualizada exitosamente',
    type: Asesoria,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o asesoría duplicada',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos - Solo profesores pueden actualizar asesorías',
  })
  @ApiResponse({
    status: 404,
    description: 'Asesoría no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  update(
    @Param('id') id: string,
    @Body() updateAsesoriaDto: UpdateAsesoriaDto,
  ): Promise<Asesoria> {
    return this.asesoriasService.update(id, updateAsesoriaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    RolUsuario.COORDINADOR,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.PROFESOR_ASIGNATURA,
  )
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Eliminar asesoría',
    description:
      'Elimina permanentemente una asesoría. Solo los profesores pueden eliminar asesorías. Esta acción no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la asesoría a eliminar',
    example: 'uuid-de-asesoria',
  })
  @ApiResponse({
    status: 200,
    description: 'Asesoría eliminada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos - Solo profesores pueden eliminar asesorías',
  })
  @ApiResponse({
    status: 404,
    description: 'Asesoría no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.asesoriasService.remove(id, req.user);
  }
}
