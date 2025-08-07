import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuatrimestresService } from './cuatrimestres.service';
import { CuatrimestresController } from './cuatrimestres.controller';
import { Cuatrimestre } from './entities/cuatrimestre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuatrimestre])],
  controllers: [CuatrimestresController],
  providers: [CuatrimestresService],
  exports: [CuatrimestresService],
})
export class CuatrimestresModule {}
