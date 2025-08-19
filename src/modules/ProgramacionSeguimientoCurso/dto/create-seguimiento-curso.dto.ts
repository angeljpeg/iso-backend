import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeguimientoCursoDto {
  @ApiProperty({ description: 'ID de la carga académica' })
  @IsUUID()
  @IsNotEmpty()
  cargaAcademicaId: string;

  @ApiProperty({ description: 'ID del cuatrimestre' })
  @IsUUID()
  @IsNotEmpty()
  cuatrimestreId: string;

  @ApiPropertyOptional({ description: 'Fecha de Revision' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaRevision?: Date;
}
