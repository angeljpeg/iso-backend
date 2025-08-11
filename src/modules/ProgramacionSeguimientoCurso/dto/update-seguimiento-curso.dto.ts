import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSeguimientoCursoDto } from './create-seguimiento-curso.dto';
import { IsOptional, IsEnum, IsDate, IsNumber } from 'class-validator';
import { EstadoSeguimiento } from '../entities/seguimiento-curso.entity';

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
  @IsDate()
  fechaRevision?: Date;

  @ApiPropertyOptional({ description: 'Fecha de seguimiento final' })
  @IsOptional()
  @IsDate()
  fechaSeguimientoFinal?: Date;

  @ApiPropertyOptional({ description: 'Número de revisión' })
  @IsOptional()
  @IsNumber()
  numeroRevision?: number;
}
