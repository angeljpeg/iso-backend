import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { getEnvVar } from '@utils/get-env-var';

export function getMailerConfig(): MailerOptions {
  return {
    transport: {
      host: getEnvVar('MAIL_HOST'),
      port: Number(getEnvVar('MAIL_PORT')),
      secure: getEnvVar('MAIL_SECURE') === 'true',
      auth: {
        user: getEnvVar('MAIL_USER'),
        pass: getEnvVar('MAIL_PASS'),
      },
    },
    defaults: {
      from: `"${getEnvVar('MAIL_FROM_NAME')}" <${getEnvVar('MAIL_FROM_EMAIL')}>`,
    },
    template: {
      dir: join(__dirname, '../modules/Correo/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
}
