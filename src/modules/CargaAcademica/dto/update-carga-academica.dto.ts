import { PartialType } from '@nestjs/swagger';
import { CreateCargaAcademicaDto } from './create-carga-academica.dto';

export class UpdateCargaAcademicaDto extends PartialType(
  CreateCargaAcademicaDto,
) {}
