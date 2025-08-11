import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutoriaDetalle } from './entities';
import { CreateTutoriaDetalleDto, UpdateTutoriaDetalleDto } from './dto';

@Injectable()
export class TutoriaDetallesService {
  constructor(
    @InjectRepository(TutoriaDetalle)
    private readonly tutoriaDetalleRepository: Repository<TutoriaDetalle>,
  ) {}

  async create(
    createTutoriaDetalleDto: CreateTutoriaDetalleDto,
  ): Promise<TutoriaDetalle> {
    // Validar que si no fue atendido, debe tener causa
    if (
      !createTutoriaDetalleDto.fueAtendido &&
      !createTutoriaDetalleDto.causaNoAtencion
    ) {
      throw new BadRequestException(
        'Si el alumno no fue atendido, debe especificar la causa',
      );
    }

    // Validar que si causó baja, debe tener causa
    if (
      createTutoriaDetalleDto.causoBaja &&
      !createTutoriaDetalleDto.causaBaja
    ) {
      throw new BadRequestException(
        'Si el alumno causó baja, debe especificar la causa',
      );
    }

    const detalle = this.tutoriaDetalleRepository.create(
      createTutoriaDetalleDto,
    );
    return await this.tutoriaDetalleRepository.save(detalle);
  }

  async findAll(): Promise<TutoriaDetalle[]> {
    return await this.tutoriaDetalleRepository.find({
      relations: ['tutoria'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TutoriaDetalle> {
    const detalle = await this.tutoriaDetalleRepository.findOne({
      where: { id },
      relations: ['tutoria'],
    });

    if (!detalle) {
      throw new NotFoundException(
        `Detalle de tutoria con ID ${id} no encontrado`,
      );
    }

    return detalle;
  }

  async findByTutoria(tutoriaId: number): Promise<TutoriaDetalle[]> {
    return await this.tutoriaDetalleRepository.find({
      where: { tutoriaId },
      relations: ['tutoria'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    id: number,
    updateTutoriaDetalleDto: UpdateTutoriaDetalleDto,
  ): Promise<TutoriaDetalle> {
    const detalle = await this.findOne(id);

    // Validar que si no fue atendido, debe tener causa
    if (
      updateTutoriaDetalleDto.fueAtendido === false &&
      !updateTutoriaDetalleDto.causaNoAtencion
    ) {
      throw new BadRequestException(
        'Si el alumno no fue atendido, debe especificar la causa',
      );
    }

    // Validar que si causó baja, debe tener causa
    if (
      updateTutoriaDetalleDto.causoBaja === true &&
      !updateTutoriaDetalleDto.causaBaja
    ) {
      throw new BadRequestException(
        'Si el alumno causó baja, debe especificar la causa',
      );
    }

    Object.assign(detalle, updateTutoriaDetalleDto);
    return await this.tutoriaDetalleRepository.save(detalle);
  }

  async remove(id: number): Promise<void> {
    const detalle = await this.findOne(id);
    await this.tutoriaDetalleRepository.remove(detalle);
  }

  async getDetallesByVulnerabilidad(
    vulnerabilidad: string,
  ): Promise<TutoriaDetalle[]> {
    return await this.tutoriaDetalleRepository.find({
      where: { vulnerabilidad: vulnerabilidad as any },
      relations: ['tutoria'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDetallesByAreaCanalizacion(area: string): Promise<TutoriaDetalle[]> {
    return await this.tutoriaDetalleRepository.find({
      where: { areaCanalizacion: area as any },
      relations: ['tutoria'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDetallesByAlumno(nombreAlumno: string): Promise<TutoriaDetalle[]> {
    return await this.tutoriaDetalleRepository.find({
      where: { nombreAlumno: nombreAlumno },
      relations: ['tutoria'],
      order: { createdAt: 'DESC' },
    });
  }

  async getEstadisticasVulnerabilidad(): Promise<Record<string, number>> {
    const detalles = await this.tutoriaDetalleRepository.find();
    const estadisticas: Record<string, number> = {};

    detalles.forEach((detalle) => {
      const vuln = detalle.vulnerabilidad;
      estadisticas[vuln] = (estadisticas[vuln] || 0) + 1;
    });

    return estadisticas;
  }

  async getEstadisticasAreaCanalizacion(): Promise<Record<string, number>> {
    const detalles = await this.tutoriaDetalleRepository.find();
    const estadisticas: Record<string, number> = {};

    detalles.forEach((detalle) => {
      const area = detalle.areaCanalizacion;
      estadisticas[area] = (estadisticas[area] || 0) + 1;
    });

    return estadisticas;
  }
}
