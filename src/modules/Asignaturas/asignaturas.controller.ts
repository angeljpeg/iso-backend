import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AsignaturasService } from './asignaturas.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('asignaturas')
@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}

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
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.asignaturasService.findAll(
      search,
      carrera,
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

  @Get(':nombre/temas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener temas de una asignatura' })
  @ApiResponse({ status: 200, description: 'Temas de la asignatura' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  getTemas(@Param('nombre') nombre: string) {
    return this.asignaturasService.getTemasByAsignatura(nombre);
  }

  @Get(':nombre/completa')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener asignatura completa con temas' })
  @ApiResponse({ status: 200, description: 'Asignatura con temas' })
  @ApiResponse({ status: 404, description: 'Asignatura no encontrada' })
  getAsignaturaCompleta(@Param('nombre') nombre: string) {
    return this.asignaturasService.findOneWithTemas(nombre);
  }
}
