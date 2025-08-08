import { PartialType } from '@nestjs/swagger';
import { CreateEstadiaDto } from './create-estadia.dto';

export class UpdateEstadiaDto extends PartialType(CreateEstadiaDto) {}
