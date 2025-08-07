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
import { CuatrimestresService } from './cuatrimestres.service';
import { CreateCuatrimestreDto } from './dto/create-cuatrimestre.dto';
import { UpdateCuatrimestreDto } from './dto/update-cuatrimestre.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { RolUsuario } from '../Usuarios/entities/usuario.entity';
import { AuthenticatedRequest } from '@interfaces/auth-request.interface';

@ApiTags('cuatrimestres')
@Controller('cuatrimestres')
export class CuatrimestresController {
  constructor(private readonly cuatrimestresService: CuatrimestresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Crear nuevo cuatrimestre (solo coordinador)' })
  @ApiResponse({ status: 201, description: 'Cuatrimestre creado exitosamente' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({
    status: 400,
    description: 'Duración inválida o fechas superpuestas',
  })
  create(
    @Body() createCuatrimestreDto: CreateCuatrimestreDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cuatrimestresService.create(createCuatrimestreDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener todos los cuatrimestres' })
  @ApiQuery({
    name: 'año',
    required: false,
    type: Number,
    description: 'Filtrar por año',
  })
  @ApiQuery({
    name: 'fechaInicio',
    required: false,
    description: 'Filtrar desde fecha de inicio (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: false,
    description: 'Filtrar hasta fecha de fin (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'actual',
    required: false,
    type: Boolean,
    description: 'Filtrar solo el cuatrimestre actual (donde estamos hoy)',
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
  @ApiResponse({ status: 200, description: 'Lista de cuatrimestres' })
  findAll(
    @Query('año') año?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('actual') actual?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const añoNumber = año ? parseInt(año, 10) : undefined;
    const actualBoolean = actual === 'true';
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    return this.cuatrimestresService.findAll(
      añoNumber,
      fechaInicio,
      fechaFin,
      actualBoolean,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Obtener cuatrimestre por ID' })
  @ApiResponse({ status: 200, description: 'Cuatrimestre encontrado' })
  @ApiResponse({ status: 404, description: 'Cuatrimestre no encontrado' })
  findOne(@Param('id') id: string) {
    return this.cuatrimestresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Actualizar cuatrimestre (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Cuatrimestre actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Cuatrimestre no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateCuatrimestreDto: UpdateCuatrimestreDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.cuatrimestresService.update(
      id,
      updateCuatrimestreDto,
      req.user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.COORDINADOR)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Eliminar cuatrimestre (solo coordinador)' })
  @ApiResponse({ status: 200, description: 'Cuatrimestre eliminado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Cuatrimestre no encontrado' })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar un cuatrimestre con datos asociados',
  })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.cuatrimestresService.remove(id, req.user);
  }
}
