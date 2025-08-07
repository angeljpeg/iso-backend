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

          // En el método findAll, cambiar:
          // Usar directamente la asignatura de los datos estáticos
          allAsignaturas.push(asignatura); // Ya incluye los temas
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

  // Obtener asignatura por nombre (más útil que por ID artificial)
  findOne(nombre: string): IAsignatura {
    try {
      // Buscar en todas las carreras
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

  // Obtener asignatura por nombre con información de carrera
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
      if (error instanceof ErrorManager) {
        throw error;
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al buscar la asignatura',
      });
    }
  }

  // Obtener todas las asignaturas de una carrera específica
  findByCarrera(codigoCarrera: string): IAsignatura[] {
    try {
      const carrera = carreras.find(
        (c) => c.codigo.toUpperCase() === codigoCarrera.toUpperCase(),
      );

      if (!carrera) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Carrera no encontrada',
        });
      }

      return carrera.asignaturas;
    } catch (error) {
      if (error instanceof ErrorManager) {
        throw error;
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener asignaturas de la carrera',
      });
    }
  }

  // Nuevo método para obtener asignatura con sus temas estáticos
  findOneWithTemas(nombre: string): IAsignatura {
    try {
      for (const carreraData of carreras) {
        for (const asignatura of carreraData.asignaturas) {
          if (asignatura.nombre.toLowerCase() === nombre.toLowerCase()) {
            // Retorna la asignatura completa con temas
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

  // Método para obtener temas de una asignatura específica
  getTemasByAsignatura(nombreAsignatura: string): ITema[] {
    try {
      for (const carreraData of carreras) {
        for (const asignatura of carreraData.asignaturas) {
          if (
            asignatura.nombre.toLowerCase() === nombreAsignatura.toLowerCase()
          ) {
            return asignatura.temas;
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
}
