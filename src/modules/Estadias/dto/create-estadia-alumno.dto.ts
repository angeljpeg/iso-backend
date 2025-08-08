import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEstadiaAlumnoDto {
  @ApiProperty({
    description: 'Nombre completo del alumno',
    example: 'Ana Sofía García López'
  })
  @IsString()
  @IsNotEmpty()
  nombreAlumno: string;

  @ApiProperty({
    description: 'Matrícula del alumno',
    example: '2024001',
    required: false
  })
  @IsString()
  @IsOptional()
  matricula?: string;

  @ApiProperty({
    description: 'Carrera que estudia el alumno',
    example: 'Ingeniería en Sistemas Computacionales',
    required: false
  })
  @IsString()
  @IsOptional()
  carrera?: string;

  @ApiProperty({
    description: 'UUID de la estadía a la que pertenece el alumno',
    example: '9e1d650f-055b-4fc9-900e-65bbcfbec4c9',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  estadiaId: string;

  @ApiProperty({
    description: 'Observaciones específicas sobre el alumno',
    example: 'Alumno destacado con excelente capacidad de análisis',
    required: false
  })
  @IsString()
  @IsOptional()
  observacionesGenerales?: string;
}
