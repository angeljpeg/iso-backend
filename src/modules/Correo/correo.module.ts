import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { CorreoService } from './correo.service';
import { CorreoController } from './correo.controller';
import { getMailerConfig } from '@config/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => getMailerConfig(),
    }),
  ],
  controllers: [CorreoController],
  providers: [CorreoService],
  exports: [CorreoService],
})
export class CorreoModule {}
