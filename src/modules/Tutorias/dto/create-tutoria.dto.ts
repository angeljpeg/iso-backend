import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTutoriaDto {
  @ApiProperty({ description: 'Nombre del cuatrimestre' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cuatrimestre: string;

  @ApiProperty({ description: 'Nombre del tutor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreTutor: string;

  @ApiProperty({ description: 'Nombre del grupo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  grupo: string;

  @ApiProperty({ description: 'Nombre de la carrera' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  carrera: string;

  @ApiProperty({ description: 'Fecha de la tutoria' })
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiPropertyOptional({ description: 'Observaciones de la tutoria' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'Actividades de tutoria grupal (máximo 5)',
    type: [String],
    maxItems: 5,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  actividadesTutoriaGrupal?: string[];

  @ApiProperty({ description: 'ID de la carga académica' })
  @IsNotEmpty()
  cargaAcademicaId: number;
}
