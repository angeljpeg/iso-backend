import { IsNotEmpty, IsDateString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDurationValid', async: false })
export class IsDurationValidConstraint implements ValidatorConstraintInterface {
  validate(fechaFin: string, args: ValidationArguments) {
    const fechaInicio = (args.object as CreateCuatrimestreDto).fechaInicio;
    if (!fechaInicio || !fechaFin) return false;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Calcular diferencia en días
    const diffTime = fin.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Validar que sea aproximadamente 4 meses (110-130 días)
    return diffDays >= 110 && diffDays <= 130;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'La duración entre fecha de inicio y fin debe ser de aproximadamente 4 meses (110-130 días)';
  }
}

@ValidatorConstraint({ name: 'isDateAfter', async: false })
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  validate(fechaFin: string, args: ValidationArguments) {
    const fechaInicio = (args.object as CreateCuatrimestreDto).fechaInicio;
    if (!fechaInicio || !fechaFin) return false;

    return new Date(fechaFin) > new Date(fechaInicio);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'La fecha de fin debe ser posterior a la fecha de inicio';
  }
}

export class CreateCuatrimestreDto {
  @ApiProperty({
    example: '2025-01-12',
    description: 'Fecha de inicio del cuatrimestre en formato YYYY-MM-DD',
  })
  @IsDateString(
    {},
    { message: 'La fecha de inicio debe estar en formato YYYY-MM-DD' },
  )
  @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
  fechaInicio: string;

  @ApiProperty({
    example: '2025-04-15',
    description: 'Fecha de fin del cuatrimestre en formato YYYY-MM-DD',
  })
  @IsDateString(
    {},
    { message: 'La fecha de fin debe estar en formato YYYY-MM-DD' },
  )
  @IsNotEmpty({ message: 'La fecha de fin es requerida' })
  @Validate(IsDateAfterConstraint)
  @Validate(IsDurationValidConstraint)
  fechaFin: string;
}
