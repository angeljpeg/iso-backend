import { PartialType } from '@nestjs/swagger';
import { CreateNecesidadesEspecialesDto } from './create-necesidades-especiales.dto';

export class UpdateNecesidadesEspecialesDto extends PartialType(
  CreateNecesidadesEspecialesDto,
) {}
