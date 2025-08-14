import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NecesidadesEspeciales } from './entities/necesidades-especiales.entity';
import {
  CreateNecesidadesEspecialesDto,
  UpdateNecesidadesEspecialesDto,
  QueryNecesidadesEspecialesDto,
} from './dto';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';

@Injectable()
export class NecesidadesEspecialesService {
  constructor(
    @InjectRepository(NecesidadesEspeciales)
    private readonly necesidadesEspecialesRepository: Repository<NecesidadesEspeciales>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
  ) {}

  async create(
    createDto: CreateNecesidadesEspecialesDto,
  ): Promise<NecesidadesEspeciales> {
    // Verificar que la carga académica existe
    const cargaAcademica = await this.cargaAcademicaRepository.findOne({
      where: { id: createDto.cargaAcademicaId },
    });

    if (!cargaAcademica) {
      throw new BadRequestException(
        'La carga académica especificada no existe',
      );
    }

    const necesidadesEspeciales =
      this.necesidadesEspecialesRepository.create(createDto);
    return await this.necesidadesEspecialesRepository.save(
      necesidadesEspeciales,
    );
  }

  async findAll(queryDto: QueryNecesidadesEspecialesDto) {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.necesidadesEspecialesRepository
      .createQueryBuilder('ne')
      .leftJoinAndSelect('ne.cargaAcademica', 'ca')
      .leftJoinAndSelect('ca.usuario', 'usuario')
      .where('ne.isDeleted = :isDeleted', { isDeleted: false });

    // Aplicar filtros
    this.applyFilters(queryBuilder, filters);

    const [necesidades, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('ne.fecha', 'DESC')
      .getManyAndCount();

    return {
      data: necesidades,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<NecesidadesEspeciales> {
    const necesidades = await this.necesidadesEspecialesRepository.findOne({
      where: { id: +id, isDeleted: false },
      relations: ['cargaAcademica', 'cargaAcademica.usuario'],
    });

    if (!necesidades) {
      throw new NotFoundException(
        `Necesidades especiales con ID ${id} no encontradas`,
      );
    }

    return necesidades;
  }

  async findByCargaAcademica(
    cargaAcademicaId: string,
  ): Promise<NecesidadesEspeciales[]> {
    return await this.necesidadesEspecialesRepository.find({
      where: { cargaAcademicaId, isDeleted: false },
      relations: ['cargaAcademica', 'cargaAcademica.usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async update(
    id: string,
    updateDto: UpdateNecesidadesEspecialesDto,
  ): Promise<NecesidadesEspeciales> {
    const necesidades = await this.findOne(id);

    if ('cargaAcademicaId' in updateDto && updateDto.cargaAcademicaId) {
      const cargaAcademica = await this.cargaAcademicaRepository.findOne({
        where: { id: updateDto.cargaAcademicaId as string },
      });

      if (!cargaAcademica) {
        throw new BadRequestException(
          'La carga académica especificada no existe',
        );
      }
    }

    Object.assign(necesidades, updateDto);
    return await this.necesidadesEspecialesRepository.save(necesidades);
  }

  async remove(id: string): Promise<void> {
    const necesidades = await this.findOne(id);
    necesidades.isDeleted = true;
    await this.necesidadesEspecialesRepository.save(necesidades);
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<NecesidadesEspeciales>,
    filters: any,
  ) {
    if (filters.nombreAlumno) {
      queryBuilder.andWhere('ne.nombreAlumno LIKE :nombreAlumno', {
        nombreAlumno: `%${filters.nombreAlumno}%`,
      });
    }

    if (filters.numeroMatricula) {
      queryBuilder.andWhere('ne.numeroMatricula LIKE :numeroMatricula', {
        numeroMatricula: `%${filters.numeroMatricula}%`,
      });
    }

    if (filters.programaEducativo) {
      queryBuilder.andWhere('ne.programaEducativo LIKE :programaEducativo', {
        programaEducativo: `%${filters.programaEducativo}%`,
      });
    }

    if (filters.nombreProfesor) {
      queryBuilder.andWhere('usuario.nombre LIKE :nombreProfesor', {
        nombreProfesor: `%${filters.nombreProfesor}%`,
      });
    }

    if (filters.cargaAcademicaId) {
      queryBuilder.andWhere('ne.cargaAcademicaId = :cargaAcademicaId', {
        cargaAcademicaId: filters.cargaAcademicaId,
      });
    }

    if (filters.excepcionesConductuales !== undefined) {
      queryBuilder.andWhere(
        'ne.excepcionesConductuales = :excepcionesConductuales',
        {
          excepcionesConductuales: filters.excepcionesConductuales,
        },
      );
    }

    if (filters.excepcionesComunicacionales !== undefined) {
      queryBuilder.andWhere(
        'ne.excepcionesComunicacionales = :excepcionesComunicacionales',
        {
          excepcionesComunicacionales: filters.excepcionesComunicacionales,
        },
      );
    }

    if (filters.excepcionesIntelectuales !== undefined) {
      queryBuilder.andWhere(
        'ne.excepcionesIntelectuales = :excepcionesIntelectuales',
        {
          excepcionesIntelectuales: filters.excepcionesIntelectuales,
        },
      );
    }

    if (filters.excepcionesFisicas !== undefined) {
      queryBuilder.andWhere('ne.excepcionesFisicas = :excepcionesFisicas', {
        excepcionesFisicas: filters.excepcionesFisicas,
      });
    }

    if (filters.excepcionesSuperdotacion !== undefined) {
      queryBuilder.andWhere(
        'ne.excepcionesSuperdotacion = :excepcionesSuperdotacion',
        {
          excepcionesSuperdotacion: filters.excepcionesSuperdotacion,
        },
      );
    }

    if (filters.fechaDesde && filters.fechaHasta) {
      queryBuilder.andWhere('ne.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta,
      });
    }
  }
}
