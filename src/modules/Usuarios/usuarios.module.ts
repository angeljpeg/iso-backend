import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { JwtStrategy } from '@strategies/jwt.strategy';
import { getEnvVar } from '@utils/get-env-var';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule,
    JwtModule.register({
      secret: getEnvVar('JWT_SECRET'),
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtStrategy],
  exports: [UsuariosService],
})
export class UsuariosModule {}
