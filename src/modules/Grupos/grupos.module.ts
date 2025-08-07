import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { Grupo } from './entities/grupo.entity';
import { CuatrimestresModule } from '../Cuatrimestres/cuatrimestres.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo]), CuatrimestresModule],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService],
})
export class GruposModule {}
