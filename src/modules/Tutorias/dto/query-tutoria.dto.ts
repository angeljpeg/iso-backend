import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoProfesor, EstadoRevision } from '../entities';

export class QueryTutoriaDto {
  @ApiPropertyOptional({ description: 'Filtrar por cuatrimestre' })
  @IsOptional()
  @IsString()
  cuatrimestre?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nombre del tutor' })
  @IsOptional()
  @IsString()
  nombreTutor?: string;

  @ApiPropertyOptional({ description: 'Filtrar por grupo' })
  @IsOptional()
  @IsString()
  grupo?: string;

  @ApiPropertyOptional({ description: 'Filtrar por carrera' })
  @IsOptional()
  @IsString()
  carrera?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado del profesor',
    enum: EstadoProfesor,
  })
  @IsOptional()
  @IsEnum(EstadoProfesor)
  estado?: EstadoProfesor;

  @ApiPropertyOptional({
    description: 'Filtrar por estado de revisión',
    enum: EstadoRevision,
  })
  @IsOptional()
  @IsEnum(EstadoRevision)
  estadoRevision?: EstadoRevision;

  @ApiPropertyOptional({ description: 'Filtrar por ID de carga académica' })
  @IsOptional()
  @IsNumber()
  cargaAcademicaId?: number;
}
