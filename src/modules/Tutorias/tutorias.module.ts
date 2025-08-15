import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutoriasController } from './tutorias.controller';
import { TutoriasService } from './tutorias.service';
import { TutoriaDetallesService } from './tutoria-detalles.service';
import { Tutoria, TutoriaDetalle } from './entities';
import { ReportesTutoriasController } from './reportes-tutorias.controller';
import { ReportesTutoriasService } from './reportes-tutorias.service';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutoria, TutoriaDetalle, CargaAcademica]),
  ],
  controllers: [TutoriasController, ReportesTutoriasController],
  providers: [TutoriasService, TutoriaDetallesService, ReportesTutoriasService],
  exports: [TutoriasService, TutoriaDetallesService, ReportesTutoriasService],
})
export class TutoriasModule {}
