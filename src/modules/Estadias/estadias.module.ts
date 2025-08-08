import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { EstadiasService } from './estadias.service';
import { EstadiasController } from './estadias.controller';
import { Estadia } from './entities/estadia.entity';
import { EstadiaAlumno } from './entities/estadia-alumno.entity';
import { ProgresoMensual } from './entities/progreso-mensual.entity';
import { UsuariosModule } from '../Usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estadia, EstadiaAlumno, ProgresoMensual]),
    PassportModule,
    UsuariosModule,
  ],
  controllers: [EstadiasController],
  providers: [EstadiasService],
  exports: [EstadiasService],
})
export class EstadiasModule {}
