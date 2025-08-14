import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
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
  cargaAcademica?: string;

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
  @IsString()
  fechaDesde?: string;

  @IsOptional()
  @IsString()
  fechaHasta?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
