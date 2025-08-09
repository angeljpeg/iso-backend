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
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('grupos')
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Crear nuevo grupo (solo coordinador)' })
  @ApiResponse({ status: 201, description: 'Grupo creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe un grupo con esta carrera, cuatrimestre y número',
  })
  create(
    @Body() createGrupoDto: CreateGrupoDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.gruposService.create(createGrupoDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todos los grupos' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre generado o carrera',
  })
  @ApiQuery({
    name: 'carrera',
    required: false,
    description: 'Filtrar por carrera',
  })
  @ApiQuery({
    name: 'cuatrimestre',
    required: false,
    type: Number,
    description: 'Filtrar por cuatrimestre',
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
  @ApiResponse({ status: 200, description: 'Lista de grupos' })
  findAll(
    @Query('search') search?: string,
    @Query('carrera') carrera?: string,
    @Query('cuatrimestre') cuatrimestre?: string,
    @Query('activo') activo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const cuatrimestreNumber = cuatrimestre
      ? parseInt(cuatrimestre, 10)
      : undefined;
    const activoBoolean = activo !== undefined ? activo === 'true' : undefined;
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.gruposService.findAll(
      search,
      carrera,
      cuatrimestreNumber,
      activoBoolean,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener grupo por ID' })
  @ApiResponse({ status: 200, description: 'Grupo encontrado' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.gruposService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar grupo (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Grupo actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateGrupoDto: UpdateGrupoDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.gruposService.update(id, updateGrupoDto, req.user);
  }

  @Delete(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Desactivar grupo (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Grupo desactivado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  deactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.gruposService.deactivate(id, req.user);
  }

  @Patch(':id/reactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'Reactivar grupo desactivado (solo coordinador)',
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo reactivado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'El grupo ya está activo' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  reactivate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.gruposService.reactivate(id, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Eliminar grupo (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Grupo eliminado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado' })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar un grupo con clases o estudiantes asignados',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.gruposService.remove(id, req.user);
  }

  @Get('carreras/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener carreras' })
  @ApiResponse({ status: 200, description: 'Carreras obtenidas' })
  getCarreras() {
    return this.gruposService.getCarreras();
  }
}
