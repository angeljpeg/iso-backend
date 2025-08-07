import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSeguimientoCursoDto } from './create-seguimiento-curso.dto';
import { IsOptional, IsEnum } from 'class-validator';
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
}
