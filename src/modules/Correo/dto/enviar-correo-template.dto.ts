import { IsEmail, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnviarCorreoTemplateDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@example.com',
  })
  @IsEmail()
  para: string;

  @ApiProperty({
    description: 'Asunto del correo',
    example: 'Notificación importante',
  })
  @IsString()
  asunto: string;

  @ApiProperty({
    description: 'Nombre de la plantilla a usar',
    example: 'bienvenida',
  })
  @IsString()
  template: string;

  @ApiProperty({
    description: 'Contexto/parámetros para la plantilla',
    example: { nombre: 'Juan Pérez', rol: 'Estudiante' },
  })
  @IsObject()
  contexto: Record<string, any>;
}
