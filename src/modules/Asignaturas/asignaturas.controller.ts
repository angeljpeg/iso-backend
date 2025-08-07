import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AsignaturasService } from './asignaturas.service';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('asignaturas')
@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Crear nueva asignatura (solo coordinador)' })
  @ApiResponse({ status: 201, description: 'Asignatura creada exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe una asignatura con este nombre en la misma carrera',
  })
  create(
    @Body() createAsignaturaDto: CreateAsignaturaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.asignaturasService.create(createAsignaturaDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todas las asignaturas' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre de asignatura',
  })
  @ApiQuery({
    name: 'carrera',
    required: false,
    description: 'Filtrar por carrera',
  })
  @ApiQuery({
    name: 'activo',
    required: false,
    type: Boolean,
    description:
      'Filtrar por estado activo/inactivo. Por defecto solo trae activos.',
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
  @ApiResponse({ status: 200, description: 'Lista de asignaturas' })
  findAll(
    @Query('search') search?: string,
    @Query('carrera') carrera?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const activoBoolean = activo !== undefined ? activo === 'true' : undefined;
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.asignaturasService.findAll(
      search,
      carrera,
      activoBoolean,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener asignatura por ID' })
  @ApiResponse({ status: 200, description: 'Asignatura encontrada' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  findOne(@Param('id') id: string) {
    return this.asignaturasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar asignatura (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Asignatura actualizada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateAsignaturaDto: UpdateAsignaturaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.asignaturasService.update(id, updateAsignaturaDto, req.user);
  }

  @Delete(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Desactivar asignatura (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Asignatura desactivada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  deactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.asignaturasService.deactivate(id, req.user);
  }

  @Patch(':id/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Reactivar asignatura desactivada (solo coordinador)',
  })
  @ApiResponse({
    status: 200,
    description: 'Asignatura reactivada exitosamente',
  })
  @ApiResponse({ status: 400, description: 'La asignatura ya está activa' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  reactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.asignaturasService.reactivate(id, req.user);
  }
}
