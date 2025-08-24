import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EnviarCorreoDto } from './dto/enviar-correo.dto';
import { EnviarCorreoTemplateDto } from './dto/enviar-correo-template.dto';
import { EnviarCorreoMasivoDto } from './dto/enviar-correo-masivo.dto';

@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envía un correo simple con texto plano
   */
  async enviarCorreo(dto: EnviarCorreoDto): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: dto.para,
        subject: dto.asunto,
        text: dto.mensaje,
        html: dto.html || dto.mensaje,
      });

      this.logger.log(`Correo enviado exitosamente a: ${dto.para}`);
      return true;
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${dto.para}:`, error);
      throw error;
    }
  }

  /**
   * Envía un correo usando una plantilla de Handlebars
   */
  async enviarCorreoTemplate(dto: EnviarCorreoTemplateDto): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: dto.para,
        subject: dto.asunto,
        template: dto.template,
        context: dto.contexto,
      });

      this.logger.log(
        `Correo con plantilla enviado exitosamente a: ${dto.para}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Error al enviar correo con plantilla a ${dto.para}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Envía correos masivos usando una plantilla
   */
  async enviarCorreoMasivo(
    dto: EnviarCorreoMasivoDto,
  ): Promise<{ exitosos: number; fallidos: number }> {
    const resultados = { exitosos: 0, fallidos: 0 };

    for (const destinatario of dto.destinatarios) {
      try {
        await this.mailerService.sendMail({
          to: destinatario.email,
          subject: dto.asunto,
          template: dto.template,
          context: {
            ...dto.contexto,
            ...destinatario.contexto,
          },
        });
        resultados.exitosos++;
        this.logger.log(
          `Correo masivo enviado exitosamente a: ${destinatario.email}`,
        );
      } catch (error) {
        resultados.fallidos++;
        this.logger.error(
          `Error al enviar correo masivo a ${destinatario.email}:`,
          error,
        );
      }
    }

    this.logger.log(
      `Envío masivo completado: ${resultados.exitosos} exitosos, ${resultados.fallidos} fallidos`,
    );
    return resultados;
  }

  /**
   * Envía correo de bienvenida a un nuevo usuario
   */
  async enviarCorreoBienvenida(
    email: string,
    nombre: string,
    rol: string,
  ): Promise<boolean> {
    return this.enviarCorreoTemplate({
      para: email,
      asunto: 'Bienvenido al Sistema ISO',
      template: 'bienvenida',
      contexto: {
        nombre,
        rol,
        fecha: new Date().toLocaleDateString('es-ES'),
      },
    });
  }

  /**
   * Envía correo de notificación de estadía
   */
  async enviarNotificacionEstadia(
    email: string,
    nombre: string,
    tipo: string,
    detalles: any,
  ): Promise<boolean> {
    return this.enviarCorreoTemplate({
      para: email,
      asunto: `Notificación de Estadía - ${tipo}`,
      template: 'estadia-notificacion',
      contexto: {
        nombre,
        tipo,
        detalles,
        fecha: new Date().toLocaleDateString('es-ES'),
      },
    });
  }

  /**
   * Envía correo de recordatorio de asesoría
   */
  async enviarRecordatorioAsesoria(
    email: string,
    nombre: string,
    fecha: Date,
    materia: string,
  ): Promise<boolean> {
    return this.enviarCorreoTemplate({
      para: email,
      asunto: 'Recordatorio de Asesoría',
      template: 'asesoria-recordatorio',
      contexto: {
        nombre,
        fecha: fecha.toLocaleDateString('es-ES'),
        materia,
      },
    });
  }

  /**
   * Verifica la conexión del servicio de correo
   */
  async verificarConexion(): Promise<boolean> {
    try {
      // Envía un correo de prueba a una dirección de verificación
      await this.mailerService.sendMail({
        to: 'test@example.com',
        subject: 'Prueba de conexión',
        text: 'Este es un correo de prueba para verificar la conexión.',
      });
      return true;
    } catch (error) {
      this.logger.error(
        'Error al verificar conexión del servicio de correo:',
        error,
      );
      return false;
    }
  }
}
