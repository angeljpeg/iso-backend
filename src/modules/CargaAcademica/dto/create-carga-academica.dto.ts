import { IsNotEmpty, IsUUID, IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCargaAcademicaDto {
  @ApiProperty({
    example: 'uuid-del-profesor',
    description: 'ID del profesor que impartirá la asignatura',
  })
  @IsNotEmpty({ message: 'El ID del profesor es obligatorio' })
  @IsUUID('4', { message: 'El ID del profesor debe ser un UUID válido' })
  profesorId: string;

  @ApiProperty({
    example: 'Tecnologías de la Información y Desarrollo de Software',
    description: 'Nombre de la carrera',
  })
  @IsNotEmpty({ message: 'El nombre de la carrera es obligatorio' })
  @IsString({ message: 'El nombre de la carrera debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El nombre de la carrera no puede exceder 100 caracteres',
  })
  carrera: string;

  @ApiProperty({
    example: 'Desarrollo de Aplicaciones Móviles',
    description: 'Nombre de la asignatura a impartir',
  })
  @IsNotEmpty({ message: 'El nombre de la asignatura es obligatorio' })
  @IsString({
    message: 'El nombre de la asignatura debe ser una cadena de texto',
  })
  @MaxLength(100, {
    message: 'El nombre de la asignatura no puede exceder 100 caracteres',
  })
  asignatura: string;

  @ApiProperty({
    example: 'uuid-del-grupo',
    description: 'ID del grupo que recibirá la asignatura',
  })
  @IsNotEmpty({ message: 'El ID del grupo es obligatorio' })
  @IsUUID('4', { message: 'El ID del grupo debe ser un UUID válido' })
  grupoId: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el profesor es tutor del grupo',
    default: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'esTutor debe ser un valor booleano' })
  esTutor?: boolean;
}
