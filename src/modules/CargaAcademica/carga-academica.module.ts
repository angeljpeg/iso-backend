import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargaAcademicaService } from './carga-academica.service';
import { CargaAcademicaController } from './carga-academica.controller';
import { CargaAcademica } from './entities/carga-academica.entity';
import { AsignaturasModule } from '../Asignaturas/asignaturas.module';
import { GruposModule } from '../Grupos/grupos.module';
import { UsuariosModule } from '../Usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CargaAcademica]),
    AsignaturasModule,
    GruposModule,
    UsuariosModule,
  ],
  controllers: [CargaAcademicaController],
  providers: [CargaAcademicaService],
  exports: [CargaAcademicaService],
})
export class CargaAcademicaModule {}
