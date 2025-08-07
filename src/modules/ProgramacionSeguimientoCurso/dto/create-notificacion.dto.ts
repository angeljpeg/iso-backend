import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoNotificacion } from '../entities/notificacion-seguimiento.entity';

export class CreateNotificacionDto {
  @ApiProperty({ description: 'ID del usuario destinatario' })
  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @ApiPropertyOptional({ description: 'ID del seguimiento relacionado' })
  @IsOptional()
  @IsUUID()
  seguimientoCursoId?: string;

  @ApiProperty({ description: 'Tipo de notificación', enum: TipoNotificacion })
  @IsEnum(TipoNotificacion)
  tipo: TipoNotificacion;

  @ApiProperty({ description: 'Título de la notificación' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ description: 'Mensaje de la notificación' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiPropertyOptional({ description: 'Metadatos adicionales' })
  @IsOptional()
  metadatos?: any;
}
