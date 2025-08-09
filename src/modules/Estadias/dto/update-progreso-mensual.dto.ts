import { PartialType } from '@nestjs/swagger';
import { CreateProgresoMensualDto } from './create-progreso-mensual.dto';

export class UpdateProgresoMensualDto extends PartialType(
  CreateProgresoMensualDto,
) {}
