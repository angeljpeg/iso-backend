import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { EstadoSeguimiento } from '../entities/seguimiento-curso.entity';
import { EstadoAvance } from '../entities/seguimiento-detalle.entity';
import {
  TipoNotificacion,
  EstadoNotificacion,
} from '../entities/notificacion-seguimiento.entity';

export class FiltrosReporteSeguimientoDto {
  @ApiProperty({ required: false, description: 'ID del cuatrimestre' })
  @IsOptional()
  @IsUUID()
  cuatrimestreId?: string;

  @ApiProperty({ required: false, description: 'ID del profesor' })
  @IsOptional()
  @IsUUID()
  profesorId?: string;

  @ApiProperty({ required: false, description: 'ID de la asignatura' })
  @IsOptional()
  @IsUUID()
  asignaturaId?: string;

  @ApiProperty({ required: false, description: 'ID del grupo' })
  @IsOptional()
  @IsUUID()
  grupoId?: string;

  @ApiProperty({
    required: false,
    enum: EstadoSeguimiento,
    description: 'Estado del seguimiento',
  })
  @IsOptional()
  @IsEnum(EstadoSeguimiento)
  estado?: EstadoSeguimiento;

  @ApiProperty({ required: false, description: 'Semana específica' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  semana?: number;

  @ApiProperty({
    required: false,
    description: 'Fecha de inicio para el rango',
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({ required: false, description: 'Fecha de fin para el rango' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    required: false,
    description: 'Solo seguimientos con retrasos',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  conRetrasos?: boolean;

  @ApiProperty({
    required: false,
    description: 'Solo seguimientos pendientes de revisión',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  pendientesRevision?: boolean;

  @ApiProperty({ required: false, description: 'Incluir detalles completos' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirDetalles?: boolean = false;
}

export class FiltrosReporteAvanceDto extends FiltrosReporteSeguimientoDto {
  @ApiProperty({
    required: false,
    enum: EstadoAvance,
    description: 'Estado del avance',
  })
  @IsOptional()
  @IsEnum(EstadoAvance)
  estadoAvance?: EstadoAvance;

  @ApiProperty({ required: false, description: 'Tema específico' })
  @IsOptional()
  @IsString()
  tema?: string;
}

export class FiltrosReporteNotificacionesDto {
  @ApiProperty({ required: false, description: 'ID del usuario' })
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @ApiProperty({
    required: false,
    enum: TipoNotificacion,
    description: 'Tipo de notificación',
  })
  @IsOptional()
  @IsEnum(TipoNotificacion)
  tipo?: TipoNotificacion;

  @ApiProperty({
    required: false,
    enum: EstadoNotificacion,
    description: 'Estado de la notificación',
  })
  @IsOptional()
  @IsEnum(EstadoNotificacion)
  estado?: EstadoNotificacion;

  @ApiProperty({
    required: false,
    description: 'Fecha de inicio para el rango',
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiProperty({ required: false, description: 'Fecha de fin para el rango' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiProperty({
    required: false,
    description: 'Solo notificaciones no leídas',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  noLeidas?: boolean;
}

export class FiltrosReporteEstadisticasDto {
  @ApiProperty({ required: false, description: 'ID del cuatrimestre' })
  @IsOptional()
  @IsUUID()
  cuatrimestreId?: string;

  @ApiProperty({ required: false, description: 'ID del profesor' })
  @IsOptional()
  @IsUUID()
  profesorId?: string;

  @ApiProperty({ required: false, description: 'Agrupar por semana' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorSemana?: boolean = false;

  @ApiProperty({ required: false, description: 'Agrupar por asignatura' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorAsignatura?: boolean = false;

  @ApiProperty({ required: false, description: 'Agrupar por grupo' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorGrupo?: boolean = false;
}

export class FiltrosReporteRetrasosDto extends FiltrosReporteSeguimientoDto {
  @ApiProperty({ required: false, description: 'Días de retraso mínimo' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  diasRetrasoMinimo?: number = 1;

  @ApiProperty({ required: false, description: 'Incluir justificaciones' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirJustificaciones?: boolean = true;

  @ApiProperty({ required: false, description: 'Incluir acciones correctivas' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirAccionesCorrectivas?: boolean = true;
}

export class FiltrosReporteCompletitudDto extends FiltrosReporteSeguimientoDto {
  @ApiProperty({
    required: false,
    description: 'Porcentaje de completitud mínimo',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  porcentajeMinimo?: number = 0;

  @ApiProperty({
    required: false,
    description: 'Porcentaje de completitud máximo',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  porcentajeMaximo?: number = 100;

  @ApiProperty({ required: false, description: 'Incluir métricas de calidad' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasCalidad?: boolean = false;
}
