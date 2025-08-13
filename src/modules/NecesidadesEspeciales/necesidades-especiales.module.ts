import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NecesidadesEspecialesController } from './necesidades-especiales.controller';
import { NecesidadesEspecialesService } from './necesidades-especiales.service';
import { NecesidadesEspeciales } from './entities/necesidades-especiales.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NecesidadesEspeciales, CargaAcademica])],
  controllers: [NecesidadesEspecialesController],
  providers: [NecesidadesEspecialesService],
  exports: [NecesidadesEspecialesService],
})
export class NecesidadesEspecialesModule {}
