import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estadia } from './entities/estadia.entity';
import { EstadiaAlumno } from './entities/estadia-alumno.entity';
import { ProgresoMensual } from './entities/progreso-mensual.entity';
import { CreateEstadiaDto } from './dto/create-estadia.dto';
import { UpdateEstadiaDto } from './dto/update-estadia.dto';
import { CreateEstadiaAlumnoDto } from './dto/create-estadia-alumno.dto';
import { UpdateEstadiaAlumnoDto } from './dto/update-estadia-alumno.dto';
import { CreateProgresoMensualDto } from './dto/create-progreso-mensual.dto';
import { UpdateProgresoMensualDto } from './dto/update-progreso-mensual.dto';

@Injectable()
export class EstadiasService {
  constructor(
    @InjectRepository(Estadia)
    private estadiaRepository: Repository<Estadia>,
    @InjectRepository(EstadiaAlumno)
    private estadiaAlumnoRepository: Repository<EstadiaAlumno>,
    @InjectRepository(ProgresoMensual)
    private progresoMensualRepository: Repository<ProgresoMensual>,
  ) {}

  // Métodos para Estadías
  async create(createEstadiaDto: CreateEstadiaDto): Promise<Estadia> {
    const estadia = this.estadiaRepository.create(createEstadiaDto);
    return await this.estadiaRepository.save(estadia);
  }

  async findAll(): Promise<Estadia[]> {
    return await this.estadiaRepository.find({
      where: { activo: true },
      relations: ['profesor', 'alumnos'],
    });
  }

  async findByProfesor(profesorId: string): Promise<Estadia[]> {
    return await this.estadiaRepository.find({
      where: { profesorId, activo: true },
      relations: ['profesor', 'alumnos'],
    });
  }

  async findOne(id: string): Promise<Estadia> {
    const estadia = await this.estadiaRepository.findOne({
      where: { id, activo: true },
      relations: ['profesor', 'alumnos', 'alumnos.progresoMensual'],
    });

    if (!estadia) {
      throw new NotFoundException(`Estadía con ID ${id} no encontrada`);
    }

    return estadia;
  }

  async update(id: string, updateEstadiaDto: UpdateEstadiaDto): Promise<Estadia> {
    const estadia = await this.findOne(id);
    Object.assign(estadia, updateEstadiaDto);
    return await this.estadiaRepository.save(estadia);
  }

  async remove(id: string): Promise<void> {
    const estadia = await this.findOne(id);
    estadia.activo = false;
    await this.estadiaRepository.save(estadia);
  }

  // Métodos para Alumnos de Estadía
  async createAlumno(createEstadiaAlumnoDto: CreateEstadiaAlumnoDto): Promise<EstadiaAlumno> {
    const estadiaAlumno = this.estadiaAlumnoRepository.create(createEstadiaAlumnoDto);
    return await this.estadiaAlumnoRepository.save(estadiaAlumno);
  }

  async findAllAlumnos(): Promise<EstadiaAlumno[]> {
    return await this.estadiaAlumnoRepository.find({
      where: { activo: true },
      relations: ['estadia', 'progresoMensual'],
    });
  }

  async findAlumnosByEstadia(estadiaId: string): Promise<EstadiaAlumno[]> {
    return await this.estadiaAlumnoRepository.find({
      where: { estadiaId, activo: true },
      relations: ['estadia', 'progresoMensual'],
    });
  }

  async findAlumno(id: string): Promise<EstadiaAlumno> {
    const alumno = await this.estadiaAlumnoRepository.findOne({
      where: { id, activo: true },
      relations: ['estadia', 'progresoMensual'],
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno de estadía con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async updateAlumno(id: string, updateEstadiaAlumnoDto: UpdateEstadiaAlumnoDto): Promise<EstadiaAlumno> {
    const alumno = await this.findAlumno(id);
    Object.assign(alumno, updateEstadiaAlumnoDto);
    return await this.estadiaAlumnoRepository.save(alumno);
  }

  async removeAlumno(id: string): Promise<void> {
    const alumno = await this.findAlumno(id);
    alumno.activo = false;
    await this.estadiaAlumnoRepository.save(alumno);
  }

  // Métodos para Progreso Mensual
  async createProgreso(createProgresoMensualDto: CreateProgresoMensualDto): Promise<ProgresoMensual> {
    // Verificar que no exista ya un progreso para este alumno y mes
    const existingProgreso = await this.progresoMensualRepository.findOne({
      where: {
        estadiaAlumnoId: createProgresoMensualDto.estadiaAlumnoId,
        mes: createProgresoMensualDto.mes,
      },
    });

    if (existingProgreso) {
      throw new BadRequestException(
        `Ya existe un progreso para este alumno en el mes ${createProgresoMensualDto.mes}`,
      );
    }

    const progreso = this.progresoMensualRepository.create(createProgresoMensualDto);
    return await this.progresoMensualRepository.save(progreso);
  }

  async findProgresoByAlumno(estadiaAlumnoId: string): Promise<ProgresoMensual[]> {
    return await this.progresoMensualRepository.find({
      where: { estadiaAlumnoId },
      relations: ['estadiaAlumno'],
      order: { mes: 'ASC' },
    });
  }

  async findProgreso(id: string): Promise<ProgresoMensual> {
    const progreso = await this.progresoMensualRepository.findOne({
      where: { id },
      relations: ['estadiaAlumno'],
    });

    if (!progreso) {
      throw new NotFoundException(`Progreso mensual con ID ${id} no encontrado`);
    }

    return progreso;
  }

  async updateProgreso(id: string, updateProgresoMensualDto: UpdateProgresoMensualDto): Promise<ProgresoMensual> {
    const progreso = await this.findProgreso(id);
    Object.assign(progreso, updateProgresoMensualDto);
    return await this.progresoMensualRepository.save(progreso);
  }

  async removeProgreso(id: string): Promise<void> {
    const progreso = await this.findProgreso(id);
    await this.progresoMensualRepository.remove(progreso);
  }

  // Método para obtener reporte completo de una estadía
  async getReporteEstadia(estadiaId: string) {
    const estadia = await this.estadiaRepository.findOne({
      where: { id: estadiaId, activo: true },
      relations: [
        'profesor',
        'alumnos',
        'alumnos.progresoMensual',
      ],
    });

    if (!estadia) {
      throw new NotFoundException(`Estadía con ID ${estadiaId} no encontrada`);
    }

    return estadia;
  }
}
