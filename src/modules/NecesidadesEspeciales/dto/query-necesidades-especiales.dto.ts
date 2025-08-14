import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryNecesidadesEspecialesDto {
  @IsOptional()
  @IsString()
  nombreAlumno?: string;

  @IsOptional()
  @IsString()
  numeroMatricula?: string;

  @IsOptional()
  @IsString()
  programaEducativo?: string;

  @IsOptional()
  @IsString()
  nombreProfesor?: string;

  @IsOptional()
  @IsString()
  cargaAcademicaId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  excepcionesConductuales?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  excepcionesComunicacionales?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  excepcionesIntelectuales?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  excepcionesFisicas?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  excepcionesSuperdotacion?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaDesde?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaHasta?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
