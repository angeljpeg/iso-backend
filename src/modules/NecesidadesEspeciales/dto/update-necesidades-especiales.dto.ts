import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNecesidadesEspecialesDto } from './create-necesidades-especiales.dto';

export class UpdateNecesidadesEspecialesDto extends PartialType(
  CreateNecesidadesEspecialesDto,
) {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaRevision?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  numeroRevision?: number;
}
