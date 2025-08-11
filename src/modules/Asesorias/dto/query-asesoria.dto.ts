import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class QueryAsesoriaDto {
  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Nombre del profesor para filtrar asesorías',
  })
  @IsOptional()
  @IsString({ message: 'El nombre del profesor debe ser una cadena de texto' })
  profesorNombre?: string;

  @ApiPropertyOptional({
    example: '2024-1',
    description: 'Nombre del cuatrimestre para filtrar asesorías',
  })
  @IsOptional()
  @IsString({
    message: 'El nombre del cuatrimestre debe ser una cadena de texto',
  })
  cuatrimestreNombre?: string;

  @ApiPropertyOptional({
    example: 'A',
    description: 'Nombre del grupo para filtrar asesorías',
  })
  @IsOptional()
  @IsString({ message: 'El nombre del grupo debe ser una cadena de texto' })
  grupoNombre?: string;

  @ApiPropertyOptional({
    example: 'Cálculo diferencial',
    description: 'Nombre del tema para filtrar asesorías',
  })
  @IsOptional()
  @IsString({ message: 'El nombre del tema debe ser una cadena de texto' })
  temaNombre?: string;

  @ApiPropertyOptional({
    example: 'Matemáticas',
    description: 'Nombre de la asignatura para filtrar asesorías',
  })
  @IsOptional()
  @IsString({
    message: 'El nombre de la asignatura debe ser una cadena de texto',
  })
  asignaturaNombre?: string;

  @ApiPropertyOptional({
    example: 'Ingeniería en Sistemas',
    description: 'Nombre de la carrera para filtrar asesorías',
  })
  @IsOptional()
  @IsString({ message: 'El nombre de la carrera debe ser una cadena de texto' })
  carreraNombre?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar solo por cuatrimestre actual',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({
    message: 'El filtro de cuatrimestre actual debe ser un booleano',
  })
  cuatrimestreActual?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página para paginación',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El número de página debe ser un entero' })
  @Min(1, { message: 'El número de página debe ser al menos 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Número de elementos por página',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite de elementos debe ser un entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  limit?: number = 10;
}
