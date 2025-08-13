import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NecesidadesEspecialesController } from './necesidades-especiales.controller';
import { NecesidadesEspecialesService } from './necesidades-especiales.service';
import { ReportesNecesidadesEspecialesController } from './reportes-necesidades-especiales.controller';
import { ReportesNecesidadesEspecialesService } from './reportes-necesidades-especiales.service';
import { NecesidadesEspeciales } from './entities/necesidades-especiales.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NecesidadesEspeciales, CargaAcademica])],
  controllers: [
    NecesidadesEspecialesController,
    ReportesNecesidadesEspecialesController,
  ],
  providers: [
    NecesidadesEspecialesService,
    ReportesNecesidadesEspecialesService,
  ],
  exports: [NecesidadesEspecialesService, ReportesNecesidadesEspecialesService],
})
export class NecesidadesEspecialesModule {}
