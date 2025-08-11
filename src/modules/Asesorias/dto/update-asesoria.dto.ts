import { PartialType } from '@nestjs/swagger';
import { CreateAsesoriaDto } from './create-asesoria.dto';

export class UpdateAsesoriaDto extends PartialType(CreateAsesoriaDto) {}
