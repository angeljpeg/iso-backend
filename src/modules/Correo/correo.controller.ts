import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CorreoService } from './correo.service';
import { EnviarCorreoDto } from './dto/enviar-correo.dto';
import { EnviarCorreoTemplateDto } from './dto/enviar-correo-template.dto';
import { EnviarCorreoMasivoDto } from './dto/enviar-correo-masivo.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Correo')
@Controller('correo')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CorreoController {
  constructor(private readonly correoService: CorreoService) {}

  @Post('enviar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar correo simple' })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarCorreo(@Body() dto: EnviarCorreoDto) {
    const resultado = await this.correoService.enviarCorreo(dto);
    return {
      success: resultado,
      message: resultado
        ? 'Correo enviado exitosamente'
        : 'Error al enviar correo',
    };
  }

  @Post('enviar-template')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar correo usando plantilla' })
  @ApiResponse({
    status: 200,
    description: 'Correo con plantilla enviado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarCorreoTemplate(@Body() dto: EnviarCorreoTemplateDto) {
    const resultado = await this.correoService.enviarCorreoTemplate(dto);
    return {
      success: resultado,
      message: resultado
        ? 'Correo con plantilla enviado exitosamente'
        : 'Error al enviar correo',
    };
  }

  @Post('enviar-masivo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar correos masivos' })
  @ApiResponse({
    status: 200,
    description: 'Correos masivos enviados',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        exitosos: { type: 'number' },
        fallidos: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarCorreoMasivo(@Body() dto: EnviarCorreoMasivoDto) {
    const resultado = await this.correoService.enviarCorreoMasivo(dto);
    return {
      success: resultado.exitosos > 0,
      exitosos: resultado.exitosos,
      fallidos: resultado.fallidos,
      message: `Envío completado: ${resultado.exitosos} exitosos, ${resultado.fallidos} fallidos`,
    };
  }

  @Post('bienvenida')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar correo de bienvenida' })
  @ApiResponse({
    status: 200,
    description: 'Correo de bienvenida enviado exitosamente',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarCorreoBienvenida(
    @Body() body: { email: string; nombre: string; rol: string },
  ) {
    const resultado = await this.correoService.enviarCorreoBienvenida(
      body.email,
      body.nombre,
      body.rol,
    );
    return {
      success: resultado,
      message: resultado
        ? 'Correo de bienvenida enviado exitosamente'
        : 'Error al enviar correo',
    };
  }

  @Post('notificacion-estadia')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar notificación de estadía' })
  @ApiResponse({
    status: 200,
    description: 'Notificación de estadía enviada exitosamente',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarNotificacionEstadia(
    @Body()
    body: {
      email: string;
      nombre: string;
      tipo: string;
      detalles: any;
    },
  ) {
    const resultado = await this.correoService.enviarNotificacionEstadia(
      body.email,
      body.nombre,
      body.tipo,
      body.detalles,
    );
    return {
      success: resultado,
      message: resultado
        ? 'Notificación enviada exitosamente'
        : 'Error al enviar notificación',
    };
  }

  @Post('recordatorio-asesoria')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar recordatorio de asesoría' })
  @ApiResponse({
    status: 200,
    description: 'Recordatorio de asesoría enviado exitosamente',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async enviarRecordatorioAsesoria(
    @Body()
    body: {
      email: string;
      nombre: string;
      fecha: string;
      materia: string;
    },
  ) {
    const resultado = await this.correoService.enviarRecordatorioAsesoria(
      body.email,
      body.nombre,
      new Date(body.fecha),
      body.materia,
    );
    return {
      success: resultado,
      message: resultado
        ? 'Recordatorio enviado exitosamente'
        : 'Error al enviar recordatorio',
    };
  }

  @Get('verificar-conexion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar conexión del servicio de correo' })
  @ApiResponse({
    status: 200,
    description: 'Estado de la conexión del servicio de correo',
    schema: {
      type: 'object',
      properties: {
        conectado: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Roles('admin', 'coordinador')
  async verificarConexion() {
    const conectado = await this.correoService.verificarConexion();
    return {
      conectado,
      message: conectado
        ? 'Servicio de correo funcionando correctamente'
        : 'Error en el servicio de correo',
    };
  }
}
