import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/Usuarios/usuarios.module';
import { AsignaturasModule } from './modules/Asignaturas/asignaturas.module';
import { TemasModule } from './modules/Temas/temas.module';
import { getTypeOrmConfig } from '@config/typeorm';
import { GruposModule } from '@modules/Grupos/grupos.module';
import { CuatrimestresModule } from './modules/Cuatrimestres/cuatrimestres.module';
import { CargaAcademicaModule } from './modules/CargaAcademica/carga-academica.module';
import { ProgramacionSeguimientoCursoModule } from '@modules/ProgramacionSeguimientoCurso/programacion-seguimiento-curso.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmConfig()),
    UsuariosModule,
    AsignaturasModule,
    TemasModule,
    UsuariosModule,
    GruposModule,
    CuatrimestresModule,
    CargaAcademicaModule,
    ProgramacionSeguimientoCursoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
