import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Vulnerabilidad,
  AreaCanalizacion,
  CausaNoAtencion,
  CausaBaja,
} from '../entities';

export class CreateTutoriaDetalleDto {
  @ApiProperty({ description: 'Nombre del alumno' })
  @IsString()
  @IsNotEmpty()
  nombreAlumno: string;

  @ApiProperty({
    description: 'Tipo de vulnerabilidad del alumno',
    enum: Vulnerabilidad,
  })
  @IsEnum(Vulnerabilidad)
  vulnerabilidad: Vulnerabilidad;

  @ApiProperty({
    description: 'Área donde fue canalizado el problema',
    enum: AreaCanalizacion,
  })
  @IsEnum(AreaCanalizacion)
  areaCanalizacion: AreaCanalizacion;

  @ApiProperty({ description: 'Indica si el alumno fue atendido' })
  @IsBoolean()
  fueAtendido: boolean;

  @ApiPropertyOptional({
    description: 'Causa por la que no fue atendido',
    enum: CausaNoAtencion,
  })
  @IsOptional()
  @IsEnum(CausaNoAtencion)
  causaNoAtencion?: CausaNoAtencion;

  @ApiProperty({ description: 'Indica si el alumno presentó mejora' })
  @IsBoolean()
  presentoMejoria: boolean;

  @ApiProperty({ description: 'Indica si el alumno causó baja' })
  @IsBoolean()
  causoBaja: boolean;

  @ApiPropertyOptional({
    description: 'Causa de la baja',
    enum: CausaBaja,
  })
  @IsOptional()
  @IsEnum(CausaBaja)
  causaBaja?: CausaBaja;

  @ApiProperty({ description: 'ID de la tutoria' })
  @IsNumber()
  @IsNotEmpty()
  tutoriaId: number;
}
