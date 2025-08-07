import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoAvance } from '../entities/seguimiento-detalle.entity';

export class CreateSeguimientoDetalleDto {
  @ApiProperty({ description: 'Nombre del Tema' })
  @IsString()
  @IsNotEmpty()
  tema: string;

  @ApiProperty({ description: 'Semana terminada' })
  @IsNotEmpty()
  semanaTerminada: number;

  @ApiProperty({ description: 'ID del seguimiento curso' })
  @IsUUID()
  @IsNotEmpty()
  seguimientoCursoId: string;

  @ApiProperty({ description: 'Estado del avance', enum: EstadoAvance })
  @IsEnum(EstadoAvance)
  estadoAvance: EstadoAvance;

  @ApiPropertyOptional({
    description: 'Justificacion del Retraso en caso de que haya.',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  justificacion?: string;

  @ApiPropertyOptional({
    description: 'Acciones a tomar sobre el Retraso en caso de que haya.',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  acciones?: string;

  @ApiPropertyOptional({ description: 'Evidencia de las acciones tomadas.' })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  evidencias?: string;
}
