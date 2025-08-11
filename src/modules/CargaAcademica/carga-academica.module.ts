import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CargaAcademicaService } from './carga-academica.service';
import { CargaAcademicaController } from './carga-academica.controller';
import { CargaAcademica } from './entities/carga-academica.entity';
import { AsignaturasModule } from '../Asignaturas/asignaturas.module';
import { GruposModule } from '../Grupos/grupos.module';
import { UsuariosModule } from '../Usuarios/usuarios.module';
import { CuatrimestresModule } from '../Cuatrimestres/cuatrimestres.module';
import { Usuario } from '../Usuarios/entities/usuario.entity';
import { Grupo } from '../Grupos/entities/grupo.entity';
import { Cuatrimestre } from '../Cuatrimestres/entities/cuatrimestre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CargaAcademica, Usuario, Grupo, Cuatrimestre]),
    AsignaturasModule,
    GruposModule,
    UsuariosModule,
    CuatrimestresModule,
  ],
  controllers: [CargaAcademicaController],
  providers: [CargaAcademicaService],
  exports: [CargaAcademicaService],
})
export class CargaAcademicaModule {}
