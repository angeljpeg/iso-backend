import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificacionAlumnoReprobadoDto {
  @ApiProperty({
    description:
      'Dirección de correo del destinatario (coordinador, profesor, etc.)',
    example: 'coordinador@utn.edu.mx',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nombre completo del alumno',
    example: 'Juan Carlos Pérez González',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Matrícula del alumno',
    example: '2021001234',
  })
  @IsString()
  matricula: string;

  @ApiProperty({
    description: 'Carrera del alumno',
    example: 'Ingeniería en Sistemas Computacionales',
  })
  @IsString()
  carrera: string;

  @ApiProperty({
    description: 'Grupo del alumno',
    example: 'ISC-2021-A',
  })
  @IsString()
  grupo: string;
}
