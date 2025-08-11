import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsesoriaDto {
  @ApiProperty({
    example: 'uuid-de-carga-academica',
    description: 'ID de la carga académica asociada a la asesoría',
  })
  @IsNotEmpty({ message: 'El ID de la carga académica es obligatorio' })
  @IsUUID('4', {
    message: 'El ID de la carga académica debe ser un UUID válido',
  })
  cargaAcademicaId: string;

  @ApiProperty({
    example: 'Métodos de integración numérica',
    description: 'Tema principal de la asesoría',
  })
  @IsNotEmpty({ message: 'El tema de la asesoría es obligatorio' })
  @IsString({ message: 'El tema de la asesoría debe ser una cadena de texto' })
  @MaxLength(200, {
    message: 'El tema de la asesoría no puede exceder 200 caracteres',
  })
  temaAsesoria: string;

  @ApiProperty({
    example: '2024-03-15',
    description: 'Fecha de la asesoría',
  })
  @IsNotEmpty({ message: 'La fecha de la asesoría es obligatoria' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  fecha: string;

  @ApiProperty({
    example: 5,
    description: 'Número de alumnos que asistirán a la asesoría',
    minimum: 1,
    maximum: 100,
  })
  @IsNotEmpty({ message: 'El número de alumnos es obligatorio' })
  @IsInt({ message: 'El número de alumnos debe ser un número entero' })
  @Min(1, { message: 'El número de alumnos debe ser al menos 1' })
  @Max(100, { message: 'El número de alumnos no puede exceder 100' })
  numeroAlumnos: number;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del alumno principal o representante del grupo',
  })
  @IsNotEmpty({ message: 'El nombre del alumno es obligatorio' })
  @IsString({ message: 'El nombre del alumno debe ser una cadena de texto' })
  @MaxLength(100, {
    message: 'El nombre del alumno no puede exceder 100 caracteres',
  })
  nombreAlumno: string;

  @ApiProperty({
    example: 90,
    description: 'Duración de la asesoría en minutos',
    minimum: 15,
    maximum: 480,
  })
  @IsNotEmpty({ message: 'La duración de la asesoría es obligatoria' })
  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(15, { message: 'La duración mínima es de 15 minutos' })
  @Max(480, { message: 'La duración máxima es de 8 horas (480 minutos)' })
  duracionAsesoria: number;
}
