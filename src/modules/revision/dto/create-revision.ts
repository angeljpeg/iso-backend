import { IsNotEmpty, IsString, IsDate, IsEnum } from 'class-validator';
import { FormatosRevision } from '../entities/revision.entity';

export class CreateRevisionDto {
  @IsString()
  @IsNotEmpty()
  observaciones: string;

  @IsDate()
  @IsNotEmpty()
  fecha_revision: Date;

  @IsDate()
  @IsNotEmpty()
  fecha_entrega: Date;

  @IsEnum(FormatosRevision)
  @IsNotEmpty()
  formato: FormatosRevision;

  @IsString()
  @IsNotEmpty()
  formato_id: string;
}
