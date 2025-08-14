import {
  IsDate,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsUUID,
  IsNumber,
  Min,
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

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaRevision?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  numeroRevision?: number;

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
  @IsUUID()
  cargaAcademica: string;
}
