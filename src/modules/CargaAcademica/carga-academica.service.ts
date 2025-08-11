import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargaAcademica } from './entities/carga-academica.entity';
import { CreateCargaAcademicaDto } from './dto/create-carga-academica.dto';
import { UpdateCargaAcademicaDto } from './dto/update-carga-academica.dto';
import { Usuario, RolUsuario } from '../Usuarios/entities/usuario.entity';
import { GruposService } from '../Grupos/grupos.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { ErrorManager } from '../../utils/error-manager';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { getCarreraByNombre, getAsignaturaByNombre } from '../../lib/carreras';

@Injectable()
export class CargaAcademicaService {
  constructor(
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
    private readonly gruposService: GruposService,
    private readonly usuariosService: UsuariosService,
  ) {}

  async create(
    createCargaAcademicaDto: CreateCargaAcademicaDto,
    createdBy: Usuario,
  ): Promise<CargaAcademica> {
    try {
      // Solo el coordinador puede crear asignaciones
      if (createdBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message:
            'Solo el coordinador puede crear asignaciones de carga académica',
        });
      }

      // Verificar que el profesor existe y es válido
      const profesor = await this.usuariosService.findOne(
        createCargaAcademicaDto.profesorId,
      );
      if (
        profesor.rol !== RolUsuario.PROFESOR_TIEMPO_COMPLETO &&
        profesor.rol !== RolUsuario.PROFESOR_ASIGNATURA
      ) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El usuario seleccionado no es un profesor',
        });
      }

      // Verificar que la carrera existe en los datos estáticos
      const carrera = getCarreraByNombre(createCargaAcademicaDto.carrera);
      if (!carrera) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'La carrera especificada no existe',
        });
      }

      // Verificar que la asignatura existe en la carrera
      const asignatura = getAsignaturaByNombre(
        createCargaAcademicaDto.carrera,
        createCargaAcademicaDto.asignatura,
      );
      if (!asignatura) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'La asignatura especificada no existe en la carrera seleccionada',
        });
      }

      // Verificar que el grupo existe
      const grupo = await this.gruposService.findOne(
        createCargaAcademicaDto.grupoId,
      );

      // Verificar que no existe una asignación duplicada
      const existingAsignacion = await this.cargaAcademicaRepository.findOne({
        where: {
          profesorId: createCargaAcademicaDto.profesorId,
          grupoId: createCargaAcademicaDto.grupoId,
          carrera: createCargaAcademicaDto.carrera,
          asignatura: createCargaAcademicaDto.asignatura,
        },
      });

      if (existingAsignacion) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'Ya existe una asignación con la misma combinación de profesor, grupo, carrera y asignatura',
        });
      }

      // Verificar que no hay otro profesor asignado a la misma asignatura y grupo
      const existingProfesorAsignacion =
        await this.cargaAcademicaRepository.findOne({
          where: {
            grupoId: createCargaAcademicaDto.grupoId,
            carrera: createCargaAcademicaDto.carrera,
            asignatura: createCargaAcademicaDto.asignatura,
          },
        });

      if (existingProfesorAsignacion) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'Ya existe otro profesor asignado a esta asignatura en el mismo grupo',
        });
      }

      // Verificar que el cuatrimestre del grupo no esté finalizado
      if (grupo.cuatrimestreRelacion.getEstado() === 'Finalizado') {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message:
            'No se pueden crear asignaciones en cuatrimestres finalizados',
        });
      }

      // Validación para tutores: un profesor solo puede ser tutor de un grupo en el mismo cuatrimestre
      if (createCargaAcademicaDto.esTutor) {
        const existingTutoriaProfesor =
          await this.cargaAcademicaRepository.findOne({
            where: {
              profesorId: createCargaAcademicaDto.profesorId,
              cuatrimestreId: grupo.cuatrimestreId,
              esTutor: true,
              activo: true,
            },
          });

        if (existingTutoriaProfesor) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'El profesor ya es tutor de otro grupo en el mismo cuatrimestre',
          });
        }

        // Validación para grupos: un grupo solo puede tener un tutor en el mismo cuatrimestre
        const existingTutoriaGrupo =
          await this.cargaAcademicaRepository.findOne({
            where: {
              grupoId: createCargaAcademicaDto.grupoId,
              cuatrimestreId: grupo.cuatrimestreId,
              esTutor: true,
              activo: true,
            },
          });

        if (existingTutoriaGrupo) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'El grupo ya tiene un tutor asignado en el mismo cuatrimestre',
          });
        }
      }

      const nuevaCarga = this.cargaAcademicaRepository.create({
        ...createCargaAcademicaDto,
        cuatrimestreId: grupo.cuatrimestreId,
      });

      return await this.cargaAcademicaRepository.save(nuevaCarga);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear la asignación');
    }
  }

  async findAll(
    profesorId?: string,
    cuatrimestreId?: string,
    grupoId?: string,
    carrera?: string,
    asignatura?: string,
    activo?: boolean,
    esTutor?: boolean,
    actual?: boolean,
    page?: number,
    limit?: number,
  ) {
    try {
      const queryBuilder = this.cargaAcademicaRepository
        .createQueryBuilder('carga')
        .innerJoinAndSelect('carga.profesor', 'profesor')
        .innerJoinAndSelect('carga.grupo', 'grupo')
        .innerJoinAndSelect('grupo.cuatrimestreRelacion', 'cuatrimestre');

      // Filtros
      if (profesorId) {
        queryBuilder.andWhere('carga.profesorId = :profesorId', { profesorId });
      }

      if (cuatrimestreId) {
        queryBuilder.andWhere('carga.cuatrimestreId = :cuatrimestreId', {
          cuatrimestreId,
        });
      }

      if (grupoId) {
        queryBuilder.andWhere('carga.grupoId = :grupoId', { grupoId });
      }

      if (carrera) {
        queryBuilder.andWhere('carga.carrera = :carrera', { carrera });
      }

      if (asignatura) {
        queryBuilder.andWhere('carga.asignatura = :asignatura', { asignatura });
      }

      if (activo !== undefined) {
        console.log('activo has value: ', activo);
        queryBuilder.andWhere('carga.activo = :activo', { activo });
      } else {
        console.log('activo is undefined: ', activo);
      }

      if (esTutor !== undefined) {
        queryBuilder.andWhere('carga.esTutor = :esTutor', { esTutor });
      }

      if (actual !== undefined) {
        if (actual) {
          const fechaActual = new Date();
          queryBuilder.andWhere(
            'cuatrimestre.fechaInicio <= :fechaActual AND cuatrimestre.fechaFin >= :fechaActual',
            { fechaActual },
          );
        }
      }

      // Ordenamiento
      queryBuilder
        .orderBy('cuatrimestre.fechaInicio', 'DESC')
        .addOrderBy('grupo.carrera', 'ASC')
        .addOrderBy('grupo.cuatrimestre', 'ASC')
        .addOrderBy('grupo.numeroGrupo', 'ASC')
        .addOrderBy('carga.asignatura', 'ASC');

      // Paginación
      if (page && limit) {
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
      }

      const [asignaciones, total] = await queryBuilder.getManyAndCount();

      console.log('Asignaciones encontradas:', asignaciones.length);
      return {
        data: asignaciones,
        total,
        page: page || 1,
        limit: limit || total,
        totalPages: limit ? Math.ceil(total / limit) : 1,
      };
    } catch (error) {
      console.error('Error en findAll:', error);
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener asignaciones de carga académica',
      });
    }
  }

  async findOne(id: string): Promise<CargaAcademica> {
    try {
      const cargaAcademica = await this.cargaAcademicaRepository.findOne({
        where: { id },
        relations: {
          grupo: {
            cuatrimestreRelacion: true,
          },
        },
      });

      if (!cargaAcademica) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Asignación de carga académica no encontrada',
        });
      }

      return cargaAcademica;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener asignación de carga académica',
      });
    }
  }

  async update(
    id: string,
    updateCargaAcademicaDto: UpdateCargaAcademicaDto,
    updatedBy: Usuario,
  ): Promise<CargaAcademica> {
    try {
      // Solo el coordinador puede editar asignaciones
      if (updatedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message:
            'Solo el coordinador puede editar asignaciones de carga académica',
        });
      }

      const cargaAcademica = await this.findOne(id);

      // Verificar referencias si se están cambiando
      if (
        updateCargaAcademicaDto.profesorId &&
        updateCargaAcademicaDto.profesorId !== cargaAcademica.profesorId
      ) {
        const profesor = await this.usuariosService.findOne(
          updateCargaAcademicaDto.profesorId,
        );
        if (
          profesor.rol !== RolUsuario.PROFESOR_TIEMPO_COMPLETO &&
          profesor.rol !== RolUsuario.PROFESOR_ASIGNATURA
        ) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'El usuario seleccionado no es un profesor',
          });
        }
      }

      // Verificar carrera si se está cambiando
      if (
        updateCargaAcademicaDto.carrera &&
        updateCargaAcademicaDto.carrera !== cargaAcademica.carrera
      ) {
        const carrera = getCarreraByNombre(updateCargaAcademicaDto.carrera);
        if (!carrera) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message: 'La carrera especificada no existe',
          });
        }
      }

      // Verificar asignatura si se está cambiando
      if (
        updateCargaAcademicaDto.asignatura &&
        updateCargaAcademicaDto.asignatura !== cargaAcademica.asignatura
      ) {
        const carreraParaValidar =
          updateCargaAcademicaDto.carrera || cargaAcademica.carrera;
        const asignatura = getAsignaturaByNombre(
          carreraParaValidar,
          updateCargaAcademicaDto.asignatura,
        );
        if (!asignatura) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'La asignatura especificada no existe en la carrera seleccionada',
          });
        }
      }

      const updateData: any = { ...updateCargaAcademicaDto };

      if (
        updateCargaAcademicaDto.grupoId &&
        updateCargaAcademicaDto.grupoId !== cargaAcademica.grupoId
      ) {
        const grupo = await this.gruposService.findOne(
          updateCargaAcademicaDto.grupoId,
        );
        updateData.cuatrimestreId = grupo.cuatrimestreId;
      }

      // Verificar duplicados si se están cambiando los campos clave
      if (
        updateCargaAcademicaDto.profesorId ||
        updateCargaAcademicaDto.grupoId ||
        updateCargaAcademicaDto.carrera ||
        updateCargaAcademicaDto.asignatura
      ) {
        const profesorId =
          updateCargaAcademicaDto.profesorId || cargaAcademica.profesorId;
        const grupoId =
          updateCargaAcademicaDto.grupoId || cargaAcademica.grupoId;
        const carrera =
          updateCargaAcademicaDto.carrera || cargaAcademica.carrera;
        const asignatura =
          updateCargaAcademicaDto.asignatura || cargaAcademica.asignatura;

        const existingAsignacion = await this.cargaAcademicaRepository.findOne({
          where: { profesorId, grupoId, carrera, asignatura },
        });

        if (existingAsignacion && existingAsignacion.id !== id) {
          throw new ErrorManager({
            type: 'BAD_REQUEST',
            message:
              'Ya existe una asignación con la misma combinación de profesor, grupo, carrera y asignatura',
          });
        }

        // Verificar que no hay otro profesor asignado a la misma asignatura y grupo
        if (
          updateCargaAcademicaDto.grupoId ||
          updateCargaAcademicaDto.carrera ||
          updateCargaAcademicaDto.asignatura
        ) {
          const existingProfesorAsignacion =
            await this.cargaAcademicaRepository.findOne({
              where: { grupoId, carrera, asignatura },
            });

          if (
            existingProfesorAsignacion &&
            existingProfesorAsignacion.id !== id
          ) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message:
                'Ya existe otro profesor asignado a esta asignatura en el mismo grupo',
            });
          }
        }
      }

      // Validaciones para tutores en actualización
      if (updateCargaAcademicaDto.esTutor !== undefined) {
        const nuevoEsTutor = updateCargaAcademicaDto.esTutor;
        const profesorId =
          updateCargaAcademicaDto.profesorId || cargaAcademica.profesorId;
        const grupoId =
          updateCargaAcademicaDto.grupoId || cargaAcademica.grupoId;
        const cuatrimestreId =
          updateData.cuatrimestreId || cargaAcademica.cuatrimestreId;

        if (nuevoEsTutor) {
          // Validación para profesores: un profesor solo puede ser tutor de un grupo en el mismo cuatrimestre
          const existingTutoriaProfesor =
            await this.cargaAcademicaRepository.findOne({
              where: {
                profesorId: profesorId,
                cuatrimestreId: cuatrimestreId,
                esTutor: true,
                activo: true,
              },
            });

          if (existingTutoriaProfesor && existingTutoriaProfesor.id !== id) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message:
                'El profesor ya es tutor de otro grupo en el mismo cuatrimestre',
            });
          }

          // Validación para grupos: un grupo solo puede tener un tutor en el mismo cuatrimestre
          const existingTutoriaGrupo =
            await this.cargaAcademicaRepository.findOne({
              where: {
                grupoId: grupoId,
                cuatrimestreId: cuatrimestreId,
                esTutor: true,
                activo: true,
              },
            });

          if (existingTutoriaGrupo && existingTutoriaGrupo.id !== id) {
            throw new ErrorManager({
              type: 'BAD_REQUEST',
              message:
                'El grupo ya tiene un tutor asignado en el mismo cuatrimestre',
            });
          }
        }
      }

      await this.cargaAcademicaRepository.update(
        id,
        updateData as QueryDeepPartialEntity<CargaAcademica>,
      );
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar asignación de carga académica',
      });
    }
  }

  async remove(id: string, deletedBy: Usuario): Promise<void> {
    try {
      // Solo el coordinador puede eliminar asignaciones
      if (deletedBy.rol !== RolUsuario.COORDINADOR) {
        throw new ErrorManager({
          type: 'FORBIDDEN',
          message:
            'Solo el coordinador puede eliminar asignaciones de carga académica',
        });
      }

      const cargaAcademica = await this.findOne(id);

      if (!cargaAcademica) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Asignación de carga académica no encontrada',
        });
      }

      if (cargaAcademica.activo === false) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'La asignación de carga académica ya está eliminada',
        });
      }

      // Soft delete - marcar como inactivo
      await this.cargaAcademicaRepository.update(id, { activo: false });
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al eliminar asignación de carga académica',
      });
    }
  }

  async findByProfesor(
    profesorId: string,
    actual?: boolean,
  ): Promise<CargaAcademica[]> {
    try {
      const queryBuilder = this.cargaAcademicaRepository
        .createQueryBuilder('carga')
        .leftJoinAndSelect('carga.grupo', 'grupo')
        .leftJoinAndSelect('grupo.cuatrimestreRelacion', 'cuatrimestre')
        .where('carga.profesorId = :profesorId', { profesorId })
        .andWhere('carga.activo = true');

      // Filtrar por cuatrimestre actual si se especifica
      if (actual) {
        const fechaActual = new Date();
        queryBuilder.andWhere(
          'cuatrimestre.fechaInicio <= :fechaActual AND cuatrimestre.fechaFin >= :fechaActual',
          { fechaActual },
        );
      }

      // Ordenar por fecha de inicio del cuatrimestre descendente, luego por asignatura y grupo
      queryBuilder
        .orderBy('cuatrimestre.fechaInicio', 'DESC')
        .addOrderBy('carga.asignatura', 'ASC')
        .addOrderBy('grupo.carrera', 'ASC')
        .addOrderBy('grupo.cuatrimestre', 'ASC')
        .addOrderBy('grupo.numeroGrupo', 'ASC');

      const cargasAcademicas = await queryBuilder.getMany();

      return cargasAcademicas;
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener carga académica del profesor',
      });
    }
  }
}
