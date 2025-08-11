import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FiltrosReporteAsesoriasDto {
  @ApiProperty({ required: false, description: 'ID del cuatrimestre' })
  @IsOptional()
  @IsUUID()
  cuatrimestreId?: string;

  @ApiProperty({ required: false, description: 'ID del profesor' })
  @IsOptional()
  @IsUUID()
  profesorId?: string;

  @ApiProperty({ required: false, description: 'Nombre de la carrera' })
  @IsOptional()
  @IsString()
  carrera?: string;

  @ApiProperty({ required: false, description: 'Nombre de la asignatura' })
  @IsOptional()
  @IsString()
  asignatura?: string;

  @ApiProperty({ required: false, description: 'ID del grupo' })
  @IsOptional()
  @IsUUID()
  grupoId?: string;

  @ApiProperty({ required: false, description: 'Tema de la asesoría' })
  @IsOptional()
  @IsString()
  temaAsesoria?: string;

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
    description: 'Número mínimo de alumnos',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numeroAlumnosMinimo?: number;

  @ApiProperty({
    required: false,
    description: 'Número máximo de alumnos',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numeroAlumnosMaximo?: number;

  @ApiProperty({
    required: false,
    description: 'Duración mínima en minutos',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duracionMinima?: number;

  @ApiProperty({
    required: false,
    description: 'Duración máxima en minutos',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duracionMaxima?: number;

  @ApiProperty({ required: false, description: 'Incluir detalles completos' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirDetalles?: boolean = false;
}

export class FiltrosReporteAsesoriasPorCarreraDto extends FiltrosReporteAsesoriasDto {
  @ApiProperty({
    required: false,
    description: 'Incluir métricas por asignatura',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorAsignatura?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas por profesor',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorProfesor?: boolean = true;
}

export class FiltrosReporteAsesoriasPorProfesorDto extends FiltrosReporteAsesoriasDto {
  @ApiProperty({
    required: false,
    description: 'Incluir métricas por carrera',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorCarrera?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas por asignatura',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorAsignatura?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas por grupo',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorGrupo?: boolean = true;
}

export class FiltrosReporteAsesoriasPorTemaDto extends FiltrosReporteAsesoriasDto {
  @ApiProperty({
    required: false,
    description: 'Incluir métricas por carrera',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorCarrera?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas por asignatura',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorAsignatura?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas por profesor',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasPorProfesor?: boolean = true;
}

export class FiltrosReporteEstadisticasAsesoriasDto extends FiltrosReporteAsesoriasDto {
  @ApiProperty({ required: false, description: 'Agrupar por semana' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorSemana?: boolean = false;

  @ApiProperty({ required: false, description: 'Agrupar por carrera' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorCarrera?: boolean = false;

  @ApiProperty({ required: false, description: 'Agrupar por profesor' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agruparPorProfesor?: boolean = false;

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

  @ApiProperty({
    required: false,
    description: 'Incluir métricas de tiempo',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasTiempo?: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Incluir métricas de alumnos',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirMetricasAlumnos?: boolean = true;
}
