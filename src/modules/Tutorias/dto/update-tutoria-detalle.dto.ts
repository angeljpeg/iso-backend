import { PartialType } from '@nestjs/swagger';
import { CreateTutoriaDetalleDto } from './create-tutoria-detalle.dto';

export class UpdateTutoriaDetalleDto extends PartialType(
  CreateTutoriaDetalleDto,
) {}
