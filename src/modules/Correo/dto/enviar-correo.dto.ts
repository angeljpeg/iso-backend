import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnviarCorreoDto {
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
    description: 'Mensaje del correo en texto plano',
    example: 'Este es un mensaje importante.',
  })
  @IsString()
  mensaje: string;

  @ApiPropertyOptional({
    description: 'Mensaje del correo en formato HTML (opcional)',
    example: '<h1>Mensaje importante</h1><p>Este es un mensaje en HTML.</p>',
  })
  @IsOptional()
  @IsString()
  html?: string;
}
