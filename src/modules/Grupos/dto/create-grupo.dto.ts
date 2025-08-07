import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { carreras } from '../../../lib/carreras';

// Obtener nombres de carreras disponibles
const carrerasDisponibles = carreras.map((carrera) => carrera.nombre);

export class CreateGrupoDto {
  @ApiProperty({
    example: 'Tecnologías de la Información y Desarrollo de Software',
    description: 'Nombre de la carrera',
    enum: carrerasDisponibles,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(carrerasDisponibles, {
    message: `La carrera debe ser una de las siguientes: ${carrerasDisponibles.join(', ')}`,
  })
  carrera: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(15)
  cuatrimestre: number;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numeroGrupo: number;

  @ApiProperty({
    example: 'uuid-del-cuatrimestre',
    description: 'ID del cuatrimestre (obligatorio)',
  })
  @IsNotEmpty({ message: 'El ID del cuatrimestre es obligatorio' })
  @IsUUID('4', { message: 'El ID del cuatrimestre debe ser un UUID válido' })
  cuatrimestreId: string;
}
