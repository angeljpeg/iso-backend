import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TemasService } from './temas.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('temas')
@Controller('temas')
export class TemasController {
  constructor(private readonly temasService: TemasService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todos los temas (datos estáticos)' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre de tema',
  })
  @ApiQuery({
    name: 'asignaturaId',
    required: false,
    description: 'Filtrar por nombre de asignatura',
  })
  @ApiQuery({
    name: 'unidad',
    required: false,
    type: Number,
    description: 'Filtrar por número de unidad',
  })
  @ApiQuery({
    name: 'activo',
    required: false,
    type: Boolean,
    description:
      'Filtrar por estado activo/inactivo (siempre true para datos estáticos)',
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
  @ApiResponse({ status: 200, description: 'Lista de temas' })
  findAll(
    @Query('search') search?: string,
    @Query('asignaturaId') asignaturaId?: string,
    @Query('unidad') unidad?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const unidadNumber = unidad ? parseInt(unidad, 10) : undefined;
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.temasService.findAll(
      search,
      asignaturaId,
      unidadNumber,
      pageNumber,
      limitNumber,
    );
  }
}
