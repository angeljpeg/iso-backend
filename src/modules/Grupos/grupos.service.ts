import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Usuario, RolUsuario } from '../Usuarios/entities/usuario.entity';
import { CuatrimestresService } from '../Cuatrimestres/cuatrimestres.service';
import { ErrorManager } from '../../utils/error-manager';
import { getCarreraByNombre, carreras } from '../../lib/carreras';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    private readonly cuatrimestresService: CuatrimestresService,
  ) {}

  async create(
    createGrupoDto: CreateGrupoDto,
    createdBy: Usuario,
  ): Promise<Grupo> {
    try {
      // Solo el coordinador puede crear grupos
      if (createdBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede crear grupos',
        });
      }

      // Validar que la carrera existe en los datos estáticos
      const carreraData = getCarreraByNombre(createGrupoDto.carrera);
      if (!carreraData) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'La carrera especificada no existe en el sistema',
        });
      }

      // Validar que el cuatrimestre existe (obligatorio)
      await this.cuatrimestresService.findOne(createGrupoDto.cuatrimestreId);

      // Verificar que no exista un grupo con la misma carrera, cuatrimestre y número
      const existingGrupo = await this.grupoRepository.findOne({
        where: {
          carrera: createGrupoDto.carrera,
          cuatrimestre: createGrupoDto.cuatrimestre,
          numeroGrupo: createGrupoDto.numeroGrupo,
        },
      });

      if (existingGrupo) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'Ya existe un grupo con esta carrera, cuatrimestre y número de grupo',
        });
      }

      const grupo = this.grupoRepository.create(createGrupoDto);
      // Generar el nombre automáticamente usando datos estáticos
      grupo.nombreGenerado = grupo.generateNombre();

      return await this.grupoRepository.save(grupo);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear grupo',
      });
    }
  }

  // Método para obtener todas las carreras disponibles desde datos estáticos
  getCarrerasDisponibles(): { nombre: string; codigo: string }[] {
    return carreras.map((carrera) => ({
      nombre: carrera.nombre,
      codigo: carrera.codigo,
    }));
  }

  async findAll(
    search?: string,
    carrera?: string,
    cuatrimestre?: number,
    activo?: boolean,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Grupo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const offset = (currentPage - 1) * currentLimit;

      const queryBuilder = this.grupoRepository
        .createQueryBuilder('grupo')
        .leftJoinAndSelect('grupo.cuatrimestreRelacion', 'cuatrimestre');

      // Por defecto solo traer grupos activos si no se especifica
      if (activo !== undefined) {
        queryBuilder.where('grupo.activo = :activo', { activo });
      } else {
        queryBuilder.where('grupo.activo = :activo', { activo: true });
      }

      if (search) {
        queryBuilder.andWhere(
          '(grupo.nombreGenerado ILIKE :search OR grupo.carrera ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (carrera) {
        queryBuilder.andWhere('grupo.carrera ILIKE :carrera', {
          carrera: `%${carrera}%`,
        });
      }

      if (cuatrimestre !== undefined) {
        queryBuilder.andWhere('grupo.cuatrimestre = :cuatrimestre', {
          cuatrimestre,
        });
      }

      queryBuilder
        .orderBy('grupo.carrera', 'ASC')
        .addOrderBy('grupo.cuatrimestre', 'ASC')
        .addOrderBy('grupo.numeroGrupo', 'ASC');

      // Obtener el total de registros sin paginación
      const total = await queryBuilder.getCount();

      // Aplicar paginación solo si se especifican los parámetros
      if (page && limit) {
        queryBuilder.skip(offset).take(currentLimit);
      }

      const data = await queryBuilder.getMany();
      const totalPages = Math.ceil(total / currentLimit);

      return {
        data,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener grupos',
      });
    }
  }

  async findOne(id: string): Promise<Grupo> {
    try {
      const grupo = await this.grupoRepository.findOne({
        where: { id },
        relations: {
          cuatrimestreRelacion: true,
        },
      });

      if (!grupo) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Grupo no encontrado',
        });
      }

      return grupo;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener grupo',
      });
    }
  }

  async update(
    id: string,
    updateGrupoDto: UpdateGrupoDto,
    updatedBy: Usuario,
  ): Promise<Grupo> {
    try {
      // Solo el coordinador puede editar grupos
      if (updatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede editar grupos',
        });
      }

      const grupo = await this.findOne(id);

      // Validar carrera si se está actualizando
      if (updateGrupoDto.carrera && updateGrupoDto.carrera !== grupo.carrera) {
        const carreraData = getCarreraByNombre(updateGrupoDto.carrera);
        if (!carreraData) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'La carrera especificada no existe en el sistema',
          });
        }
      }

      // Validar cuatrimestre si se está actualizando
      if (
        updateGrupoDto.cuatrimestreId &&
        updateGrupoDto.cuatrimestreId !== grupo.cuatrimestreId
      ) {
        await this.cuatrimestresService.findOne(updateGrupoDto.cuatrimestreId);
      }

      // Verificar duplicados si se están cambiando campos únicos
      if (
        updateGrupoDto.carrera ||
        updateGrupoDto.cuatrimestre ||
        updateGrupoDto.numeroGrupo
      ) {
        const carrera = updateGrupoDto.carrera || grupo.carrera;
        const cuatrimestre = updateGrupoDto.cuatrimestre || grupo.cuatrimestre;
        const numeroGrupo = updateGrupoDto.numeroGrupo || grupo.numeroGrupo;

        const existingGrupo = await this.grupoRepository.findOne({
          where: { carrera, cuatrimestre, numeroGrupo },
        });

        if (existingGrupo && existingGrupo.id !== id) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'Ya existe un grupo con esta carrera, cuatrimestre y número de grupo',
          });
        }
      }

      // Actualizar el grupo
      await this.grupoRepository.update(id, updateGrupoDto);
      const updatedGrupo = await this.findOne(id);

      // Regenerar el nombre si cambió algún campo relevante
      if (
        updateGrupoDto.carrera ||
        updateGrupoDto.cuatrimestre ||
        updateGrupoDto.numeroGrupo
      ) {
        updatedGrupo.nombreGenerado = updatedGrupo.generateNombre();
        await this.grupoRepository.save(updatedGrupo);
      }

      return updatedGrupo;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar grupo',
      });
    }
  }

  async deactivate(id: string, deactivatedBy: Usuario): Promise<Grupo> {
    try {
      // Solo el coordinador puede desactivar grupos
      if (deactivatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede desactivar grupos',
        });
      }

      const grupo = await this.findOne(id);

      if (!grupo.activo) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El grupo ya está desactivado',
        });
      }

      grupo.activo = false;
      return await this.grupoRepository.save(grupo);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al desactivar grupo',
      });
    }
  }

  async reactivate(id: string, reactivatedBy: Usuario): Promise<Grupo> {
    try {
      // Solo el coordinador puede reactivar grupos
      if (reactivatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede reactivar grupos',
        });
      }

      const grupo = await this.findOne(id);

      if (grupo.activo) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El grupo ya está activo',
        });
      }

      grupo.activo = true;
      return await this.grupoRepository.save(grupo);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al reactivar grupo',
      });
    }
  }

  async remove(id: string, deletedBy: Usuario): Promise<void> {
    try {
      // Solo el coordinador puede eliminar grupos
      if (deletedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede eliminar grupos',
        });
      }

      const grupo = await this.findOne(id);

      // TODO: Verificar que no esté asociado a clases activas o estudiantes
      // Esta validación se implementará cuando existan esos módulos

      await this.grupoRepository.remove(grupo);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al eliminar grupo',
      });
    }
  }

  getCarreras() {
    return carreras;
  }
}
