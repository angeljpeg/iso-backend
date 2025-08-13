import { PartialType } from '@nestjs/mapped-types';
import { CreateNecesidadesEspecialesDto } from './create-necesidades-especiales.dto';

export class UpdateNecesidadesEspecialesDto extends PartialType(
  CreateNecesidadesEspecialesDto,
) {}
