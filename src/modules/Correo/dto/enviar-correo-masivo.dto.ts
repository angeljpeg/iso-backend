import { IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DestinatarioDto {
  @ApiProperty({
    description: 'Dirección de correo del destinatario',
    example: 'usuario@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Contexto específico para este destinatario',
    example: { nombre: 'Juan Pérez', grupo: 'A' },
  })
  @IsObject()
  contexto: Record<string, any>;
}

export class EnviarCorreoMasivoDto {
  @ApiProperty({
    description: 'Lista de destinatarios',
    type: [DestinatarioDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DestinatarioDto)
  destinatarios: DestinatarioDto[];

  @ApiProperty({
    description: 'Asunto del correo',
    example: 'Notificación general',
  })
  @IsString()
  asunto: string;

  @ApiProperty({
    description: 'Nombre de la plantilla a usar',
    example: 'notificacion-general',
  })
  @IsString()
  template: string;

  @ApiProperty({
    description: 'Contexto común para todos los destinatarios',
    example: { fecha: '2024-01-15', tipo: 'Recordatorio' },
  })
  @IsObject()
  contexto: Record<string, any>;
}
