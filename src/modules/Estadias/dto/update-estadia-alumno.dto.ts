import { PartialType } from '@nestjs/swagger';
import { CreateEstadiaAlumnoDto } from './create-estadia-alumno.dto';

export class UpdateEstadiaAlumnoDto extends PartialType(CreateEstadiaAlumnoDto) {}
