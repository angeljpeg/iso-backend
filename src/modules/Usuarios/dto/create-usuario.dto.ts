import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'juan.perez@universidad.edu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.PROFESOR_ASIGNATURA })
  @IsEnum(RolUsuario)
  rol: RolUsuario;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
