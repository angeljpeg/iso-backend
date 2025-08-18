import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Asesoria } from './entities/asesoria.entity';
import { CargaAcademicaService } from '../CargaAcademica/carga-academica.service';
import { ErrorManager } from '../../utils/error-manager';
import { CreateAsesoriaDto } from './dto/create-asesoria.dto';
import { UpdateAsesoriaDto } from './dto/update-asesoria.dto';
import { AsesoriaResponseDto } from './dto/asesoria-response.dto';

@Injectable()
export class AsesoriasService {
  constructor(
    @InjectRepository(Asesoria)
    private readonly asesoriaRepository: Repository<Asesoria>,
    private readonly cargaAcademicaService: CargaAcademicaService,
  ) {}

  // Método de prueba temporal para debuggear
  async testRelations(): Promise<any> {
    try {
      console.log('Probando relaciones básicas...');

      // Consulta simple sin JOINs complejos
      const asesorias = await this.asesoriaRepository.find({
        where: { activo: true },
        take: 1,
      });

      console.log('Asesorías encontradas (sin relaciones):', asesorias.length);

      if (asesorias.length > 0) {
        const asesoria = asesorias[0];
        console.log('Primera asesoría:', {
          id: asesoria.id,
          temaAsesoria: asesoria.temaAsesoria,
          cargaAcademicaId: asesoria.cargaAcademicaId,
        });

        // Intentar cargar relaciones una por una
        const asesoriaConRelaciones = await this.asesoriaRepository.findOne({
          where: { id: asesoria.id },
          relations: ['cargaAcademica'],
        });

        console.log(
          'Asesoría con carga académica:',
          asesoriaConRelaciones?.cargaAcademica ? 'OK' : 'ERROR',
        );

        if (asesoriaConRelaciones?.cargaAcademica) {
          const cargaAcademica = asesoriaConRelaciones.cargaAcademica;
          console.log('Carga académica:', {
            id: cargaAcademica.id,
            carrera: cargaAcademica.carrera,
            asignatura: cargaAcademica.asignatura,
          });
        }
      }

      return { success: true, message: 'Prueba de relaciones completada' };
    } catch (error) {
      console.error('Error en prueba de relaciones:', error);
      return { success: false, error: error.message };
    }
  }

  async create(createAsesoriaDto: CreateAsesoriaDto): Promise<Asesoria> {
    try {
      // Verificar que la carga académica existe
      await this.cargaAcademicaService.findOne(
        createAsesoriaDto.cargaAcademicaId,
      );

      // Verificar que no existe una asesoría duplicada para la misma carga académica, fecha y tema
      const existingAsesoria = await this.asesoriaRepository.findOne({
        where: {
          cargaAcademicaId: createAsesoriaDto.cargaAcademicaId,
          fecha: new Date(createAsesoriaDto.fecha),
          temaAsesoria: createAsesoriaDto.temaAsesoria,
        },
      });

      if (existingAsesoria) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'Ya existe una asesoría con el mismo tema para la misma carga académica y fecha',
        });
      }

      const asesoria = this.asesoriaRepository.create(createAsesoriaDto);
      return await this.asesoriaRepository.save(asesoria);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(
    profesorNombre?: string,
    cuatrimestreNombre?: string,
    grupoNombre?: string,
    temaNombre?: string,
    asignaturaNombre?: string,
    carreraNombre?: string,
    cuatrimestreActual?: boolean,
    page: number = 1,
    limit: number = 10,
  ): Promise<AsesoriaResponseDto> {
    try {
      console.log('Iniciando findAll asesorías con parámetros:', {
        profesorNombre,
        cuatrimestreNombre,
        grupoNombre,
        temaNombre,
        asignaturaNombre,
        carreraNombre,
        cuatrimestreActual,
        page,
        limit,
      });

      const queryBuilder = this.asesoriaRepository
        .createQueryBuilder('asesoria')
        .leftJoinAndSelect('asesoria.cargaAcademica', 'cargaAcademica')
        .leftJoinAndSelect('cargaAcademica.profesor', 'profesor')
        .leftJoinAndSelect('cargaAcademica.grupo', 'grupo')
        .leftJoinAndSelect('cargaAcademica.cuatrimestre', 'cuatrimestre')
        .where('asesoria.activo = :activo', { activo: true });

      console.log('QueryBuilder creado, aplicando filtros...');

      // Filtros de búsqueda
      if (profesorNombre) {
        queryBuilder.andWhere('profesor.nombre ILIKE :profesorNombre', {
          profesorNombre: `%${profesorNombre}%`,
        });
      }

      if (cuatrimestreNombre) {
        queryBuilder.andWhere(
          'cuatrimestre.nombreGenerado ILIKE :cuatrimestreNombre',
          {
            cuatrimestreNombre: `%${cuatrimestreNombre}%`,
          },
        );
      }

      if (grupoNombre) {
        queryBuilder.andWhere('grupo.nombreGenerado ILIKE :grupoNombre', {
          grupoNombre: `%${grupoNombre}%`,
        });
      }

      if (temaNombre) {
        queryBuilder.andWhere('asesoria.temaAsesoria ILIKE :temaNombre', {
          temaNombre: `%${temaNombre}%`,
        });
      }

      if (asignaturaNombre) {
        queryBuilder.andWhere(
          'cargaAcademica.asignatura ILIKE :asignaturaNombre',
          {
            asignaturaNombre: `%${asignaturaNombre}%`,
          },
        );
      }

      if (carreraNombre) {
        queryBuilder.andWhere('cargaAcademica.carrera ILIKE :carreraNombre', {
          carreraNombre: `%${carreraNombre}%`,
        });
      }

      if (cuatrimestreActual) {
        queryBuilder.andWhere('cuatrimestre.activo = :cuatrimestreActivo', {
          cuatrimestreActivo: true,
        });
      }

      console.log('Filtros aplicados, ejecutando consulta...');

      // Paginación
      const total = await queryBuilder.getCount();
      console.log('Total de registros encontrados:', total);

      const data = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('asesoria.fecha', 'DESC')
        .getMany();

      console.log('Datos obtenidos exitosamente, cantidad:', data.length);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error en findAll asesorías:', error);
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Asesoria> {
    try {
      const asesoria = await this.asesoriaRepository.findOne({
        where: { id, activo: true },
        relations: [
          'cargaAcademica',
          'cargaAcademica.profesor',
          'cargaAcademica.grupo',
          'cargaAcademica.cuatrimestre',
        ],
      });

      if (!asesoria) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: `Asesoría con ID ${id} no encontrada`,
        });
      }

      return asesoria;
    } catch (error) {
      console.error('Error en findOne asesorías:', error);
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findByCargaAcademicaId(cargaAcademicaId: string): Promise<Asesoria[]> {
    try {
      console.log(
        'Buscando asesorías para carga académica ID:',
        cargaAcademicaId,
      );

      const result = await this.asesoriaRepository.find({
        where: { cargaAcademicaId, activo: true },
        relations: [
          'cargaAcademica',
          'cargaAcademica.profesor',
          'cargaAcademica.grupo',
          'cargaAcademica.cuatrimestre',
        ],
        order: { fecha: 'DESC' },
      });

      console.log('Asesorías encontradas:', result.length);
      return result;
    } catch (error) {
      console.error('Error en findByCargaAcademicaId asesorías:', error);
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    updateAsesoriaDto: UpdateAsesoriaDto,
  ): Promise<Asesoria> {
    try {
      const asesoria = await this.findOne(id);

      // Verificar que no existe una asesoría duplicada para la misma carga académica, fecha y tema
      if (
        updateAsesoriaDto.fecha ||
        updateAsesoriaDto.temaAsesoria ||
        updateAsesoriaDto.cargaAcademicaId
      ) {
        const existingAsesoria = await this.asesoriaRepository.findOne({
          where: {
            cargaAcademicaId:
              updateAsesoriaDto.cargaAcademicaId || asesoria.cargaAcademicaId,
            fecha: updateAsesoriaDto.fecha
              ? new Date(updateAsesoriaDto.fecha)
              : asesoria.fecha,
            temaAsesoria:
              updateAsesoriaDto.temaAsesoria || asesoria.temaAsesoria,
            id: Not(id), // Excluir la asesoría actual
          },
        });

        if (existingAsesoria) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'Ya existe una asesoría con el mismo tema para la misma carga académica y fecha',
          });
        }
      }

      Object.assign(asesoria, updateAsesoriaDto);
      return await this.asesoriaRepository.save(asesoria);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const asesoria = await this.findOne(id);

      // Eliminación física (no soft-delete según requerimientos)
      await this.asesoriaRepository.remove(asesoria);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new InternalServerErrorException(error);
    }
  }
}
