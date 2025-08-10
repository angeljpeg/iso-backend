import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeguimientoCurso } from './entities/seguimiento-curso.entity';
import { SeguimientoDetalle } from './entities/seguimiento-detalle.entity';
import { CreateSeguimientoCursoDto } from './dto/create-seguimiento-curso.dto';
import { UpdateSeguimientoCursoDto } from './dto/update-seguimiento-curso.dto';
import { CreateSeguimientoDetalleDto } from './dto/create-seguimiento-detalle.dto';
import { UpdateSeguimientoDetalleDto } from './dto/update-seguimiento-detalle.dto';
import { Usuario, RolUsuario } from '../Usuarios/entities/usuario.entity';
import { CargaAcademica } from '../CargaAcademica/entities/carga-academica.entity';
import { ErrorManager } from '@utils/error-manager';
import { getTemaByNombre } from 'src/lib/carreras';
import { isUUID } from 'class-validator';

@Injectable()
export class ProgramacionSeguimientoCursoService {
  constructor(
    @InjectRepository(SeguimientoCurso)
    private readonly seguimientoCursoRepository: Repository<SeguimientoCurso>,
    @InjectRepository(SeguimientoDetalle)
    private readonly seguimientoDetalleRepository: Repository<SeguimientoDetalle>,
    @InjectRepository(CargaAcademica)
    private readonly cargaAcademicaRepository: Repository<CargaAcademica>,
  ) {}

  async create(
    createSeguimientoCursoDto: CreateSeguimientoCursoDto,
    usuario: Usuario,
  ) {
    try {
      if (usuario.rol !== RolUsuario.COORDINADOR) {
        throw new ForbiddenException(
          'Solo los coordinadores pueden crear seguimientos de curso',
        );
      }

      // Corrección: lógica invertida
      const cargaAcademica = await this.cargaAcademicaRepository.findOneBy({
        id: createSeguimientoCursoDto.cargaAcademicaId,
      });

      if (!cargaAcademica) {
        throw new BadRequestException(
          'La carga académica especificada no existe',
        );
      }

      const seguimientoCurso = this.seguimientoCursoRepository.create({
        ...createSeguimientoCursoDto,
      });

      return await this.seguimientoCursoRepository.save(seguimientoCurso);
    } catch (error) {
      // Manejo mejorado de errores
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  // Corrección del nombre del parámetro
  async createDetalle(
    seguimientoId: string, // Cambio de nombre para mayor claridad
    createDetalleDto: CreateSeguimientoDetalleDto,
    usuario: Usuario,
  ) {
    try {
      const seguimientoCurso = await this.seguimientoCursoRepository.findOne({
        where: { id: seguimientoId },
        relations: ['cargaAcademica'],
      });

      if (!seguimientoCurso) {
        throw new BadRequestException('Seguimiento de curso no encontrado');
      }

      if (usuario.id !== seguimientoCurso.cargaAcademica.profesorId) {
        throw new ForbiddenException(
          'No tienes permiso para crear un detalle en este seguimiento de curso',
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const temaExists = getTemaByNombre(createDetalleDto.tema);
      if (!temaExists) {
        throw new BadRequestException('El tema especificado no existe');
      }

      const detalle = this.seguimientoDetalleRepository.create({
        ...createDetalleDto,
        seguimientoCurso,
      });

      return await this.seguimientoDetalleRepository.save(detalle);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.seguimientoCursoRepository.find({
      relations: ['detalles', 'cargaAcademica'],
    });
  }

  async findOne(id: string) {
    const seguimiento = await this.seguimientoCursoRepository.findOne({
      where: { id },
      relations: ['detalles', 'cargaAcademica'],
    });
    if (!seguimiento)
      throw new BadRequestException('Seguimiento no encontrado');
    return seguimiento;
  }

  async findOneByCargaAcademicaId(cargaAcademicaId: string) {
    if (!isUUID(cargaAcademicaId))
      throw new BadRequestException('ID de carga académica inválido');
    const seguimiento = await this.seguimientoCursoRepository.find({
      where: { cargaAcademica: { id: cargaAcademicaId } },
      relations: ['detalles', 'cargaAcademica'],
    });
    if (!seguimiento)
      throw new BadRequestException('Seguimiento no encontrado');
    return seguimiento;
  }

  async update(id: string, dto: UpdateSeguimientoCursoDto, usuario: Usuario) {
    try {
      const seguimiento = await this.seguimientoCursoRepository.findOne({
        where: { id },
        relations: ['cargaAcademica'],
      });

      if (!seguimiento) {
        throw new BadRequestException('Seguimiento no encontrado');
      }

      // Validación de permisos
      this.validateSeguimientoPermissions(seguimiento, usuario, 'update');

      Object.assign(seguimiento, dto);
      return await this.seguimientoCursoRepository.save(seguimiento);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async remove(id: string, usuario: Usuario) {
    try {
      const seguimiento = await this.seguimientoCursoRepository.findOne({
        where: { id },
        relations: ['cargaAcademica'],
      });

      if (!seguimiento) {
        throw new BadRequestException('Seguimiento no encontrado');
      }

      // Validación de permisos
      this.validateSeguimientoPermissions(seguimiento, usuario, 'delete');

      await this.seguimientoCursoRepository.remove(seguimiento);
      return { deleted: true };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  // Detalles
  async findDetalles(seguimientoId: string) {
    const seguimiento = await this.seguimientoCursoRepository.findOne({
      where: { id: seguimientoId },
      relations: ['detalles'],
    });
    if (!seguimiento)
      throw new BadRequestException('Seguimiento no encontrado');
    return seguimiento.detalles;
  }

  async updateDetalle(
    seguimientoId: string,
    detalleId: string,
    dto: UpdateSeguimientoDetalleDto,
    usuario: Usuario,
  ) {
    try {
      const detalle = await this.seguimientoDetalleRepository.findOne({
        where: { id: detalleId, seguimientoCurso: { id: seguimientoId } },
        relations: ['seguimientoCurso', 'seguimientoCurso.cargaAcademica'],
      });

      if (!detalle) {
        throw new BadRequestException('Detalle no encontrado');
      }

      // Validación de permisos
      this.validateDetallePermissions(detalle, usuario, 'update');

      // Validar tema si se está actualizando
      if (dto.tema) {
        const temaExists = getTemaByNombre(dto.tema);
        if (!temaExists) {
          throw new BadRequestException('El tema especificado no existe');
        }
      }

      Object.assign(detalle, dto);
      return await this.seguimientoDetalleRepository.save(detalle);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  async removeDetalle(
    seguimientoId: string,
    detalleId: string,
    usuario: Usuario,
  ) {
    try {
      const detalle = await this.seguimientoDetalleRepository.findOne({
        where: { id: detalleId, seguimientoCurso: { id: seguimientoId } },
        relations: ['seguimientoCurso', 'seguimientoCurso.cargaAcademica'],
      });

      if (!detalle) {
        throw new BadRequestException('Detalle no encontrado');
      }

      // Validación de permisos
      this.validateDetallePermissions(detalle, usuario, 'delete');

      await this.seguimientoDetalleRepository.remove(detalle);
      return { deleted: true };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        ErrorManager.createSignatureError(error.message);
      }
      throw error;
    }
  }

  // Métodos privados para validación de permisos
  private validateSeguimientoPermissions(
    seguimiento: SeguimientoCurso,
    usuario: Usuario,
    action: 'update' | 'delete',
  ) {
    // Los coordinadores pueden hacer cualquier acción
    if (usuario.rol === RolUsuario.COORDINADOR) {
      return;
    }

    // Los profesores solo pueden modificar detalles de sus propios seguimientos
    if (
      usuario.rol === RolUsuario.PROFESOR_ASIGNATURA ||
      usuario.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO
    ) {
      if (usuario.id !== seguimiento.cargaAcademica.profesorId) {
        throw new ForbiddenException(
          `No tienes permiso para ${action === 'update' ? 'actualizar' : 'eliminar'} este detalle de seguimiento`,
        );
      }
      return;
    }

    // Los directores pueden ver y actualizar, pero no eliminar
    if (usuario.rol === RolUsuario.MODERADOR) {
      if (action === 'delete') {
        throw new ForbiddenException(
          'Los directores no pueden eliminar seguimientos de curso',
        );
      }
      return;
    }

    // Cualquier otro rol no tiene permisos
    throw new ForbiddenException(
      `No tienes permisos para ${action === 'update' ? 'actualizar' : 'eliminar'} seguimientos de curso`,
    );
  }

  private validateDetallePermissions(
    detalle: SeguimientoDetalle,
    usuario: Usuario,
    action: 'update' | 'delete',
  ) {
    // Los coordinadores pueden hacer cualquier acción
    if (usuario.rol === RolUsuario.COORDINADOR) {
      return;
    }

    // Los profesores solo pueden modificar detalles de sus propios seguimientos
    if (
      usuario.rol === RolUsuario.PROFESOR_ASIGNATURA ||
      usuario.rol === RolUsuario.PROFESOR_TIEMPO_COMPLETO
    ) {
      if (usuario.id !== detalle.seguimientoCurso.cargaAcademica.profesorId) {
        throw new ForbiddenException(
          `No tienes permiso para ${action === 'update' ? 'actualizar' : 'eliminar'} este detalle de seguimiento`,
        );
      }
      return;
    }

    // Los directores pueden ver y actualizar, pero no eliminar
    if (usuario.rol === RolUsuario.MODERADOR) {
      if (action === 'delete') {
        throw new ForbiddenException(
          'Los directores no pueden eliminar detalles de seguimiento',
        );
      }
      return;
    }

    // Cualquier otro rol no tiene permisos
    throw new ForbiddenException(
      `No tienes permisos para ${action === 'update' ? 'actualizar' : 'eliminar'} detalles de seguimiento`,
    );
  }
}
