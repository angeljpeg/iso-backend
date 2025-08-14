import {
  IsDate,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNecesidadesEspecialesDto {
  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreAlumno: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numeroMatricula: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  programaEducativo: string;

  @IsDate()
  @Type(() => Date)
  fechaRevision: Date;

  @IsNumber()
  @Min(1)
  numeroRevision: number;

  // Excepciones conductuales
  @IsBoolean()
  excepcionesConductuales: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  especificacionConductual?: string;

  // Excepciones comunicacionales
  @IsBoolean()
  excepcionesComunicacionales: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  especificacionComunicacional?: string;

  // Excepciones intelectuales
  @IsBoolean()
  excepcionesIntelectuales: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  especificacionIntelectual?: string;

  // Excepciones físicas
  @IsBoolean()
  excepcionesFisicas: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  especificacionFisica?: string;

  // Excepciones de superdotación
  @IsBoolean()
  excepcionesSuperdotacion: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  especificacionSuperdotacion?: string;

  // Otras necesidades especiales
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  otrasNecesidades?: string;

  // Relación con carga académica
  @IsString()
  cargaAcademicaId: string;
}
