import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuatrimestre } from './entities/cuatrimestre.entity';
import { CreateCuatrimestreDto } from './dto/create-cuatrimestre.dto';
import { UpdateCuatrimestreDto } from './dto/update-cuatrimestre.dto';
import { Usuario, RolUsuario } from '../Usuarios/entities/usuario.entity';
import { ErrorManager } from '../../utils/error-manager';

@Injectable()
export class CuatrimestresService {
  constructor(
    @InjectRepository(Cuatrimestre)
    private readonly cuatrimestreRepository: Repository<Cuatrimestre>,
  ) {}

  async create(
    createCuatrimestreDto: CreateCuatrimestreDto,
    createdBy: Usuario,
  ): Promise<Cuatrimestre> {
    try {
      // Solo el coordinador puede crear cuatrimestres
      if (createdBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede crear cuatrimestres',
        });
      }

      // Verificar que no haya cuatrimestres superpuestos
      await this.validateNoOverlap(
        new Date(createCuatrimestreDto.fechaInicio),
        new Date(createCuatrimestreDto.fechaFin),
      );

      const cuatrimestre = this.cuatrimestreRepository.create({
        fechaInicio: new Date(createCuatrimestreDto.fechaInicio),
        fechaFin: new Date(createCuatrimestreDto.fechaFin),
      });

      // Validar duración
      if (!cuatrimestre.validateDuration()) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'La duración del cuatrimestre debe ser de aproximadamente 4 meses (110-130 días)',
        });
      }

      // Generar el nombre automáticamente
      cuatrimestre.nombreGenerado = cuatrimestre.generateNombre();

      return await this.cuatrimestreRepository.save(cuatrimestre);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear cuatrimestre',
      });
    }
  }

  async findAll(
    año?: number,
    fechaInicio?: string,
    fechaFin?: string,
    actual?: boolean,
    page?: number,
    limit?: number,
  ): Promise<{
    data: (Cuatrimestre & { estado: string })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const offset = (currentPage - 1) * currentLimit;

      const queryBuilder =
        this.cuatrimestreRepository.createQueryBuilder('cuatrimestre');

      // Filtrar por año si se especifica
      if (año) {
        queryBuilder.andWhere(
          'EXTRACT(YEAR FROM cuatrimestre.fechaInicio) = :año OR EXTRACT(YEAR FROM cuatrimestre.fechaFin) = :año',
          { año },
        );
      }

      // Filtrar por rango de fechas
      if (fechaInicio) {
        queryBuilder.andWhere('cuatrimestre.fechaInicio >= :fechaInicio', {
          fechaInicio: new Date(fechaInicio),
        });
      }

      if (fechaFin) {
        queryBuilder.andWhere('cuatrimestre.fechaFin <= :fechaFin', {
          fechaFin: new Date(fechaFin),
        });
      }

      // Filtrar por cuatrimestre actual (donde estamos hoy)
      if (actual) {
        const fechaActual = new Date();
        queryBuilder.andWhere(
          'cuatrimestre.fechaInicio <= :fechaActual AND cuatrimestre.fechaFin >= :fechaActual',
          { fechaActual },
        );
      }

      // Ordenar por fecha de inicio descendente
      queryBuilder.orderBy('cuatrimestre.fechaInicio', 'DESC');

      // Obtener el total de registros
      const total = await queryBuilder.getCount();

      // Aplicar paginación si se especifica
      if (page && limit) {
        queryBuilder.skip(offset).take(currentLimit);
      }

      const cuatrimestres = await queryBuilder.getMany();

      // Agregar el estado a cada cuatrimestre
      const data = cuatrimestres.map((cuatrimestre) => ({
        ...cuatrimestre,
        estado: cuatrimestre.getEstado(),
      }));

      const totalPages = Math.ceil(total / currentLimit);

      return {
        data: data as (Cuatrimestre & { estado: string })[],
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
        message: 'Error al obtener cuatrimestres',
      });
    }
  }

  async findOne(id: string): Promise<Cuatrimestre & { estado: string }> {
    try {
      const cuatrimestre = await this.cuatrimestreRepository.findOne({
        where: { id },
      });

      if (!cuatrimestre) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Cuatrimestre no encontrado',
        });
      }

      return {
        ...cuatrimestre,
        estado: cuatrimestre.getEstado(),
      } as Cuatrimestre & { estado: string };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener cuatrimestre',
      });
    }
  }

  async update(
    id: string,
    updateCuatrimestreDto: UpdateCuatrimestreDto,
    updatedBy: Usuario,
  ): Promise<Cuatrimestre> {
    try {
      // Solo el coordinador puede editar cuatrimestres
      if (updatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede editar cuatrimestres',
        });
      }

      const cuatrimestre = await this.cuatrimestreRepository.findOne({
        where: { id },
      });

      if (!cuatrimestre) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Cuatrimestre no encontrado',
        });
      }

      // Verificar si el cuatrimestre está en uso (aquí se podría agregar lógica para verificar grupos asociados)
      // Por ahora, permitimos la edición

      // Actualizar fechas si se proporcionan
      if (updateCuatrimestreDto.fechaInicio) {
        cuatrimestre.fechaInicio = new Date(updateCuatrimestreDto.fechaInicio);
      }
      if (updateCuatrimestreDto.fechaFin) {
        cuatrimestre.fechaFin = new Date(updateCuatrimestreDto.fechaFin);
      }

      // Validar duración después de la actualización
      if (!cuatrimestre.validateDuration()) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'La duración del cuatrimestre debe ser de aproximadamente 4 meses (110-130 días)',
        });
      }

      // Verificar que no haya superposición con otros cuatrimestres
      await this.validateNoOverlap(
        cuatrimestre.fechaInicio,
        cuatrimestre.fechaFin,
        id,
      );

      // Regenerar el nombre
      cuatrimestre.nombreGenerado = cuatrimestre.generateNombre();

      return await this.cuatrimestreRepository.save(cuatrimestre);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar cuatrimestre',
      });
    }
  }

  async remove(id: string, deletedBy: Usuario): Promise<{ message: string }> {
    try {
      // Solo el coordinador puede eliminar cuatrimestres
      if (deletedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message: 'Solo el coordinador puede eliminar cuatrimestres',
        });
      }

      const cuatrimestre = await this.cuatrimestreRepository.findOne({
        where: { id },
      });

      if (!cuatrimestre) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Cuatrimestre no encontrado',
        });
      }

      // Verificar que no esté asociado a grupos (aquí se podría agregar la verificación)
      // Por ahora, permitimos la eliminación

      await this.cuatrimestreRepository.remove(cuatrimestre);

      return { message: 'Cuatrimestre eliminado exitosamente' };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al eliminar cuatrimestre',
      });
    }
  }

  private async validateNoOverlap(
    fechaInicio: Date,
    fechaFin: Date,
    excludeId?: string,
  ): Promise<void> {
    const queryBuilder =
      this.cuatrimestreRepository.createQueryBuilder('cuatrimestre');

    queryBuilder.where(
      '(cuatrimestre.fechaInicio <= :fechaFin AND cuatrimestre.fechaFin >= :fechaInicio)',
      { fechaInicio, fechaFin },
    );

    if (excludeId) {
      queryBuilder.andWhere('cuatrimestre.id != :excludeId', { excludeId });
    }

    const overlapping = await queryBuilder.getOne();

    if (overlapping) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message:
          'Las fechas del cuatrimestre se superponen con un cuatrimestre existente',
      });
    }
  }
}
