import { PartialType } from '@nestjs/swagger';
import { CreateCuatrimestreDto } from './create-cuatrimestre.dto';

export class UpdateCuatrimestreDto extends PartialType(CreateCuatrimestreDto) {}
