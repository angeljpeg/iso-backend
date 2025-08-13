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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NecesidadesEspecialesService } from './necesidades-especiales.service';
import {
  CreateNecesidadesEspecialesDto,
  UpdateNecesidadesEspecialesDto,
  QueryNecesidadesEspecialesDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolUsuario } from '@modules/Usuarios/entities/usuario.entity';

@ApiTags('Necesidades Especiales')
@Controller('necesidades-especiales')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NecesidadesEspecialesController {
  constructor(
    private readonly necesidadesEspecialesService: NecesidadesEspecialesService,
  ) {}

  @Post()
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Crear un nuevo registro de necesidades especiales',
  })
  @ApiResponse({
    status: 201,
    description: 'Registro de necesidades especiales creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o carga académica no encontrada',
  })
  async create(@Body() createDto: CreateNecesidadesEspecialesDto) {
    return await this.necesidadesEspecialesService.create(createDto);
  }

  @Get()
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary:
      'Obtener todos los registros de necesidades especiales con filtros',
  })
  @ApiQuery({
    name: 'nombreAlumno',
    required: false,
    description: 'Filtrar por nombre del alumno',
  })
  @ApiQuery({
    name: 'numeroMatricula',
    required: false,
    description: 'Filtrar por número de matrícula',
  })
  @ApiQuery({
    name: 'programaEducativo',
    required: false,
    description: 'Filtrar por programa educativo',
  })
  @ApiQuery({
    name: 'nombreProfesor',
    required: false,
    description: 'Filtrar por nombre del profesor',
  })
  @ApiQuery({
    name: 'cargaAcademicaId',
    required: false,
    description: 'Filtrar por ID de carga académica',
  })
  @ApiQuery({
    name: 'excepcionesConductuales',
    required: false,
    description: 'Filtrar por excepciones conductuales',
  })
  @ApiQuery({
    name: 'excepcionesComunicacionales',
    required: false,
    description: 'Filtrar por excepciones comunicacionales',
  })
  @ApiQuery({
    name: 'excepcionesIntelectuales',
    required: false,
    description: 'Filtrar por excepciones intelectuales',
  })
  @ApiQuery({
    name: 'excepcionesFisicas',
    required: false,
    description: 'Filtrar por excepciones físicas',
  })
  @ApiQuery({
    name: 'excepcionesSuperdotacion',
    required: false,
    description: 'Filtrar por excepciones de superdotación',
  })
  @ApiQuery({
    name: 'fechaDesde',
    required: false,
    description: 'Filtrar desde fecha',
  })
  @ApiQuery({
    name: 'fechaHasta',
    required: false,
    description: 'Filtrar hasta fecha',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de registros por página',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de necesidades especiales',
  })
  async findAll(@Query() queryDto: QueryNecesidadesEspecialesDto) {
    return await this.necesidadesEspecialesService.findAll(queryDto);
  }

  @Get(':id')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Obtener un registro de necesidades especiales por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Registro de necesidades especiales encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de necesidades especiales no encontrado',
  })
  async findOne(@Param('id') id: string) {
    return await this.necesidadesEspecialesService.findOne(+id);
  }

  @Get('carga-academica/:cargaAcademicaId')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({
    summary: 'Obtener registros de necesidades especiales por carga académica',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de registros de necesidades especiales para la carga académica',
  })
  async findByCargaAcademica(
    @Param('cargaAcademicaId') cargaAcademicaId: string,
  ) {
    return await this.necesidadesEspecialesService.findByCargaAcademica(
      +cargaAcademicaId,
    );
  }

  @Patch(':id')
  @Roles(
    RolUsuario.PROFESOR_ASIGNATURA,
    RolUsuario.PROFESOR_TIEMPO_COMPLETO,
    RolUsuario.COORDINADOR,
  )
  @ApiOperation({ summary: 'Actualizar un registro de necesidades especiales' })
  @ApiResponse({
    status: 200,
    description: 'Registro de necesidades especiales actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de necesidades especiales no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o carga académica no encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateNecesidadesEspecialesDto,
  ) {
    return await this.necesidadesEspecialesService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.COORDINADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un registro de necesidades especiales (soft delete)',
  })
  @ApiResponse({
    status: 204,
    description: 'Registro de necesidades especiales eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Registro de necesidades especiales no encontrado',
  })
  async remove(@Param('id') id: string) {
    await this.necesidadesEspecialesService.remove(+id);
  }
}
