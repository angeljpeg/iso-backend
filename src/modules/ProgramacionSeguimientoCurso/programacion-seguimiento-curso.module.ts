import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ProgramacionSeguimientoCursoService } from './programacion-seguimiento-curso.service';
import { ProgramacionSeguimientoCursoController } from './programacion-seguimiento-curso.controller';
import { ReportesSeguimientoService } from './reportes-seguimiento.service';
import { ReportesSeguimientoController } from './reportes-seguimiento.controller';
import { SeguimientoCurso } from './entities/seguimiento-curso.entity';
import { SeguimientoDetalle } from './entities/seguimiento-detalle.entity';
import { NotificacionSeguimiento } from './entities/notificacion-seguimiento.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';
import { Usuario } from '../Usuarios/entities/usuario.entity';
import { Cuatrimestre } from '../Cuatrimestres/entities/cuatrimestre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SeguimientoCurso,
      SeguimientoDetalle,
      NotificacionSeguimiento,
      CargaAcademica,
      Usuario,
      Cuatrimestre,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    ProgramacionSeguimientoCursoController,
    ReportesSeguimientoController,
  ],
  providers: [ProgramacionSeguimientoCursoService, ReportesSeguimientoService],
  exports: [ProgramacionSeguimientoCursoService, ReportesSeguimientoService],
})
export class ProgramacionSeguimientoCursoModule {}
