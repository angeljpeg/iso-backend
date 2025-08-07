import { Injectable } from '@nestjs/common';
import { carreras } from '../../lib/carreras';
import { ErrorManager } from '../../utils/error-manager';
import { ITema } from '../../common/interfaces/carrera.interface';

@Injectable()
export class TemasService {
  constructor() {}

  // Obtener todos los temas con filtros
  findAll(
    search?: string,
    asignaturaId?: string,
    unidad?: number,
    page?: number,
    limit?: number,
  ): {
    data: ITema[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const allTemas: ITema[] = [];
    try {
      // Recopilar todos los temas de todas las carreras y asignaturas
      for (const carrera of carreras) {
        for (const asignatura of carrera.asignaturas) {
          // Filtrar por asignatura si se especifica
          if (asignaturaId && asignatura.nombre !== asignaturaId) {
            continue;
          }

          for (const tema of asignatura.temas) {
            // Filtrar por unidad si se especifica
            if (unidad !== undefined && tema.unidad !== unidad) {
              continue;
            }

            // Filtrar por búsqueda si se especifica
            if (
              search &&
              !tema.nombre.toLowerCase().includes(search.toLowerCase())
            ) {
              continue;
            }

            // Agregar el tema tal como está, sin formateo adicional
            allTemas.push(tema);
          }
        }
      }

      // Aplicar paginación
      const pageNumber = page || 1;
      const limitNumber = limit || 10;
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = startIndex + limitNumber;

      const paginatedTemas = allTemas.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allTemas.length / limitNumber);

      return {
        data: paginatedTemas,
        total: allTemas.length,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
      };
    } catch (error) {
      if (error instanceof ErrorManager) {
        ErrorManager.createSignatureError(error.message);
      }
      throw new ErrorManager({
        type: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener los temas',
      });
    }
  }
}
