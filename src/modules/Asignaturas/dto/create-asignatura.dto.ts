import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsignaturaDto {
  @ApiProperty({ example: 'Programación I' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Ingeniería en Sistemas' })
  @IsString()
  @IsNotEmpty()
  carrera: string;
}
