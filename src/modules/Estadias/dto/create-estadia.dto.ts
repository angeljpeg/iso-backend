import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstadiaDto {
  @ApiProperty({
    description:
      'UUID del profesor (se asigna automáticamente del usuario autenticado)',
    example: '7f02c8e4-0a38-4604-943c-786f02c2be09',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  profesorId: string;

  @ApiProperty({
    description: 'Período académico de la estadía',
    example: '2024-1',
  })
  @IsString()
  @IsNotEmpty()
  periodo: string;

  @ApiProperty({
    description: 'Observaciones generales sobre la estadía',
    example: 'Estadías enfocadas en desarrollo de software empresarial',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacionesGenerales?: string;
}
