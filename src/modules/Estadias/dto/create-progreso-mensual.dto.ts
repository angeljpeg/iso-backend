import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Mes, AvanceAlumno } from '../entities/progreso-mensual.entity';

export class CreateProgresoMensualDto {
  @ApiProperty({
    description: 'UUID del alumno de estadía',
    example: '1c8a9d5c-866c-4589-b3a5-dd61615cbf44',
    format: 'uuid'
  })
  @IsUUID()
  @IsNotEmpty()
  estadiaAlumnoId: string;

  @ApiProperty({
    description: 'Mes de evaluación (1-4)',
    example: 1,
    enum: Mes
  })
  @IsEnum(Mes)
  @IsNotEmpty()
  mes: Mes;

  @ApiProperty({
    description: 'Indica si el alumno tuvo avance en el mes',
    example: 'si',
    enum: AvanceAlumno,
    required: false
  })
  @IsEnum(AvanceAlumno)
  @IsOptional()
  avance?: AvanceAlumno;

  @ApiProperty({
    description: 'Acciones tomadas cuando no hay avance',
    example: 'Se programaron sesiones de asesoría adicionales y se estableció un plan de trabajo más detallado',
    required: false
  })
  @IsString()
  @IsOptional()
  accionesTomadas?: string;

  @ApiProperty({
    description: 'Fecha de evaluación',
    example: '2024-02-15',
    format: 'date',
    required: false
  })
  @IsDateString()
  @IsOptional()
  fechaEvaluacion?: string;

  @ApiProperty({
    description: 'Observaciones sobre el progreso del alumno',
    example: 'Excelente progreso en la definición del proyecto',
    required: false
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
