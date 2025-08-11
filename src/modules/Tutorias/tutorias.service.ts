import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Tutoria, EstadoProfesor, EstadoRevision } from './entities';
import { CreateTutoriaDto, UpdateTutoriaDto, QueryTutoriaDto } from './dto';

@Injectable()
export class TutoriasService {
  constructor(
    @InjectRepository(Tutoria)
    private readonly tutoriaRepository: Repository<Tutoria>,
  ) {}

  async create(createTutoriaDto: CreateTutoriaDto): Promise<Tutoria> {
    const tutoria = this.tutoriaRepository.create({
      ...createTutoriaDto,
      fecha: new Date(createTutoriaDto.fecha),
      estado: EstadoProfesor.EN_PROGRESO,
      estadoRevision: EstadoRevision.SIN_REVISAR,
    });

    return await this.tutoriaRepository.save(tutoria);
  }

  async findAll(queryDto: QueryTutoriaDto = {}): Promise<Tutoria[]> {
    const where: FindOptionsWhere<Tutoria> = {};

    if (queryDto.cuatrimestre) {
      where.cuatrimestre = Like(`%${queryDto.cuatrimestre}%`);
    }

    if (queryDto.nombreTutor) {
      where.nombreTutor = Like(`%${queryDto.nombreTutor}%`);
    }

    if (queryDto.grupo) {
      where.grupo = Like(`%${queryDto.grupo}%`);
    }

    if (queryDto.carrera) {
      where.carrera = Like(`%${queryDto.carrera}%`);
    }

    if (queryDto.estado) {
      where.estado = queryDto.estado;
    }

    if (queryDto.estadoRevision) {
      where.estadoRevision = queryDto.estadoRevision;
    }

    if (queryDto.cargaAcademicaId) {
      where.cargaAcademicaId = queryDto.cargaAcademicaId;
    }

    return await this.tutoriaRepository.find({
      where,
      relations: ['cargaAcademica', 'detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Tutoria> {
    const tutoria = await this.tutoriaRepository.findOne({
      where: { id },
      relations: ['cargaAcademica', 'detalles'],
    });

    if (!tutoria) {
      throw new NotFoundException(`Tutoria con ID ${id} no encontrada`);
    }

    return tutoria;
  }

  async findByCargaAcademica(cargaAcademicaId: number): Promise<Tutoria[]> {
    return await this.tutoriaRepository.find({
      where: { cargaAcademicaId },
      relations: ['cargaAcademica', 'detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: number,
    updateTutoriaDto: UpdateTutoriaDto,
  ): Promise<Tutoria> {
    const tutoria = await this.findOne(id);

    // Validar que no se pueda cambiar el estado a completado si hay detalles sin completar
    if (
      updateTutoriaDto.estado === EstadoProfesor.COMPLETADO &&
      tutoria.detalles?.some((detalle) => !detalle.fueAtendido)
    ) {
      throw new BadRequestException(
        'No se puede marcar como completada una tutoria con alumnos sin atender',
      );
    }

    // Si se está marcando como completada, actualizar fecha de revisión
    if (updateTutoriaDto.estado === EstadoProfesor.COMPLETADO) {
      updateTutoriaDto.fechaRevision = new Date();
    }

    // Convertir fecha si se proporciona
    if (updateTutoriaDto.fecha) {
      updateTutoriaDto.fecha = new Date(updateTutoriaDto.fecha);
    }

    Object.assign(tutoria, updateTutoriaDto);
    return await this.tutoriaRepository.save(tutoria);
  }

  async updateEstadoRevision(
    id: number,
    estadoRevision: EstadoRevision,
  ): Promise<Tutoria> {
    const tutoria = await this.findOne(id);

    // Solo permitir transiciones válidas de estado
    if (
      tutoria.estadoRevision === EstadoRevision.ACEPTADO &&
      estadoRevision !== EstadoRevision.ACEPTADO
    ) {
      throw new BadRequestException(
        'No se puede cambiar el estado de una tutoria ya aceptada',
      );
    }

    if (
      tutoria.estadoRevision === EstadoRevision.RECHAZADO &&
      estadoRevision !== EstadoRevision.RECHAZADO
    ) {
      throw new BadRequestException(
        'No se puede cambiar el estado de una tutoria rechazada',
      );
    }

    tutoria.estadoRevision = estadoRevision;
    return await this.tutoriaRepository.save(tutoria);
  }

  async remove(id: number): Promise<void> {
    const tutoria = await this.findOne(id);
    await this.tutoriaRepository.remove(tutoria);
  }

  async getTutoriasByProfesor(nombreTutor: string): Promise<Tutoria[]> {
    return await this.tutoriaRepository.find({
      where: { nombreTutor: Like(`%${nombreTutor}%`) },
      relations: ['cargaAcademica', 'detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTutoriasByCarrera(carrera: string): Promise<Tutoria[]> {
    return await this.tutoriaRepository.find({
      where: { carrera: Like(`%${carrera}%`) },
      relations: ['cargaAcademica', 'detalles'],
      order: { createdAt: 'DESC' },
    });
  }

  async getTutoriasByCuatrimestre(cuatrimestre: string): Promise<Tutoria[]> {
    return await this.tutoriaRepository.find({
      where: { cuatrimestre: Like(`%${cuatrimestre}%`) },
      relations: ['cargaAcademica', 'detalles'],
      order: { createdAt: 'DESC' },
    });
  }
}
