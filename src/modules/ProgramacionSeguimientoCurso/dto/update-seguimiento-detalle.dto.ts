import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSeguimientoDetalleDto } from './create-seguimiento-detalle.dto';
import {
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { EstadoAvance } from '../entities/seguimiento-detalle.entity';

export class UpdateSeguimientoDetalleDto extends PartialType(
  CreateSeguimientoDetalleDto,
) {
  @ApiPropertyOptional({ description: 'Nombre del Tema' })
  @IsString()
  @IsOptional()
  tema?: string;

  @ApiPropertyOptional({ description: 'Semana terminada' })
  @IsNumber()
  @IsOptional()
  semanaTerminada?: number;

  @ApiPropertyOptional({ description: 'Estado del avance', enum: EstadoAvance })
  @IsEnum(EstadoAvance)
  @IsOptional()
  estadoAvance?: EstadoAvance;

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

  @ApiPropertyOptional({ description: 'Observaciones adicionales' })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  observaciones?: string;
}
