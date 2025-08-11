import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsesoriasService } from './asesorias.service';
import { AsesoriasController } from './asesorias.controller';
import { Asesoria } from './entities/asesoria.entity';
import { CargaAcademicaModule } from '../CargaAcademica/carga-academica.module';

@Module({
  imports: [TypeOrmModule.forFeature([Asesoria]), CargaAcademicaModule],
  controllers: [AsesoriasController],
  providers: [AsesoriasService],
  exports: [AsesoriasService],
})
export class AsesoriasModule {}
