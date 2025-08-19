import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSeguimientoCursoDto } from './create-seguimiento-curso.dto';
import { IsOptional, IsEnum, IsDate, IsNumber } from 'class-validator';
import { EstadoSeguimiento } from '../entities/seguimiento-curso.entity';
import { Type } from 'class-transformer';

export class UpdateSeguimientoCursoDto extends PartialType(
  CreateSeguimientoCursoDto,
) {
  @ApiPropertyOptional({
    description: 'Estado del seguimiento',
    enum: EstadoSeguimiento,
  })
  @IsOptional()
  @IsEnum(EstadoSeguimiento)
  estado?: EstadoSeguimiento;

  @ApiPropertyOptional({ description: 'Fecha de revisión' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaRevision?: Date;

  @ApiPropertyOptional({ description: 'Fecha de seguimiento final' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaSeguimientoFinal?: Date;

  @ApiPropertyOptional({ description: 'Fecha de entregado' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaEntregado?: Date;

  @ApiPropertyOptional({ description: 'Número de revisión' })
  @IsOptional()
  @IsNumber()
  numeroRevision?: number;
}
