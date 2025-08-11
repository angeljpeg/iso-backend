import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutoriasController } from './tutorias.controller';
import { TutoriasService } from './tutorias.service';
import { TutoriaDetallesService } from './tutoria-detalles.service';
import { Tutoria, TutoriaDetalle } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Tutoria, TutoriaDetalle])],
  controllers: [TutoriasController],
  providers: [TutoriasService, TutoriaDetallesService],
  exports: [TutoriasService, TutoriaDetallesService],
})
export class TutoriasModule {}
