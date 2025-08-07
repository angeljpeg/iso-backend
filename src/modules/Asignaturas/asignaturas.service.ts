import { Injectable } from '@nestjs/common';
import { carreras } from '../../lib/carreras';
import { IAsignatura, ICarrera, ITema } from '@interfaces/carrera.interface';
import { ErrorManager } from '../../utils/error-manager';

@Injectable()
export class AsignaturasService {
  constructor() {}

  // Obtener todas las asignaturas con filtros
  findAll(
    search?: string,
    carrera?: string,
    page?: number,
    limit?: number,
  ): {
    data: IAsignatura[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    try {
      const allAsignaturas: IAsignatura[] = [];

      // Recopilar todas las asignaturas de todas las carreras
      for (const carreraData of carreras) {
        // Filtrar por carrera si se especifica
        if (
          carrera &&
          !carreraData.nombre.toLowerCase().includes(carrera.toLowerCase())
        ) {
          continue;
        }

        for (const asignatura of carreraData.asignaturas) {
          // Filtrar por búsqueda si se especifica
          if (
            search &&
            !asignatura.nombre.toLowerCase().includes(search.toLowerCase())
          ) {
            continue;
          }

          // Usar directamente la asignatura de los datos estáticos
          allAsignaturas.push(asignatura);
        }
      }

      // Ordenar por nombre de asignatura
      allAsignaturas.sort((a, b) => a.nombre.localeCompare(b.nombre));

      // Aplicar paginación
      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const startIndex = (currentPage - 1) * currentLimit;
      const endIndex = startIndex + currentLimit;

      const paginatedAsignaturas =
        page && limit
          ? allAsignaturas.slice(startIndex, endIndex)
          : allAsignaturas;
      const totalPages = Math.ceil(allAsignaturas.length / currentLimit);

      return {
        data: paginatedAsignaturas,
        total: allAsignaturas.length,
        page: currentPage,
        limit: currentLimit,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Obtener asignatura por nombre
  findOne(nombre: string): IAsignatura {
    try {
      for (const carreraData of carreras) {
        for (const asignatura of carreraData.asignaturas) {
          if (asignatura.nombre.toLowerCase() === nombre.toLowerCase()) {
            return asignatura;
          }
        }
      }

      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Asignatura no encontrada',
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Obtener asignatura con información de carrera
  findOneWithCarrera(nombre: string): {
    asignatura: IAsignatura;
    carrera: ICarrera;
  } {
    try {
      for (const carreraData of carreras) {
        for (const asignatura of carreraData.asignaturas) {
          if (asignatura.nombre.toLowerCase() === nombre.toLowerCase()) {
            return {
              asignatura,
              carrera: carreraData,
            };
          }
        }
      }

      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Asignatura no encontrada',
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Obtener asignaturas por carrera
  findByCarrera(codigoCarrera: string): IAsignatura[] {
    try {
      const carreraData = carreras.find(
        (c) => c.codigo.toLowerCase() === codigoCarrera.toLowerCase(),
      );

      if (!carreraData) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Carrera no encontrada',
        });
      }

      return carreraData.asignaturas;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Obtener asignatura con temas (redundante ya que IAsignatura incluye temas)
  findOneWithTemas(nombre: string): IAsignatura {
    return this.findOne(nombre); // Los temas ya están incluidos
  }

  // Obtener temas de una asignatura específica
  getTemasByAsignatura(nombreAsignatura: string): ITema[] {
    try {
      const asignatura = this.findOne(nombreAsignatura);
      return asignatura.temas;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
