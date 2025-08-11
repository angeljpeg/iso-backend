import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsesoriasService } from './asesorias.service';
import { AsesoriasController } from './asesorias.controller';
import { ReportesAsesoriasService } from './reportes-asesorias.service';
import { ReportesAsesoriasController } from './reportes-asesorias.controller';
import { Asesoria } from './entities/asesoria.entity';
import { CargaAcademicaModule } from '../CargaAcademica/carga-academica.module';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';
import { Usuario } from '../Usuarios/entities/usuario.entity';
import { Grupo } from '../Grupos/entities/grupo.entity';
import { Cuatrimestre } from '../Cuatrimestres/entities/cuatrimestre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asesoria,
      CargaAcademica,
      Usuario,
      Grupo,
      Cuatrimestre,
    ]),
    CargaAcademicaModule,
  ],
  controllers: [AsesoriasController, ReportesAsesoriasController],
  providers: [AsesoriasService, ReportesAsesoriasService],
  exports: [AsesoriasService, ReportesAsesoriasService],
})
export class AsesoriasModule {}
