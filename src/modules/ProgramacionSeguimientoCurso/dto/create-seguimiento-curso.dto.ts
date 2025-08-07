import { IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeguimientoCursoDto {
  @ApiProperty({ description: 'ID de la carga académica' })
  @IsUUID()
  @IsNotEmpty()
  cargaAcademicaId: string;

  @ApiPropertyOptional({ description: 'Fecha de Revision' })
  @IsDate()
  @IsOptional()
  fechaRevision?: Date;
}
