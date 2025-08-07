import { IAsignatura, ICarrera, ITema } from '@interfaces/carrera.interface';
import { TIDS } from './tids';

export const carreras: ICarrera[] = [TIDS];

export const carrerasByNombre = carreras.reduce(
  (acc, carrera) => {
    acc[carrera.nombre.toUpperCase()] = carrera;
    return acc;
  },
  {} as Record<string, ICarrera>,
);

export const getCarreraByCodigo = (codigo: string): ICarrera | undefined => {
  return carreras.find((carrera) => carrera.codigo.toUpperCase() === codigo);
};

export const getCarreraByNombre = (nombre: string): ICarrera | undefined => {
  return carreras.find((carrera) =>
    carrera.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );
};

export const getAsignaturaByNombre = (
  carrera: string,
  nombre: string,
): { carrera: ICarrera; asignatura: string } | undefined => {
  const carreraObj = carrerasByNombre[carrera.toUpperCase()];
  if (!carreraObj) {
    return undefined;
  }
  const asignatura = carreraObj.asignaturas.find((asig) =>
    asig.nombre.toLowerCase().includes(nombre.toLowerCase()),
  );
  if (asignatura) {
    return { carrera: carreraObj, asignatura: asignatura.nombre };
  }
  return undefined;
};

export const getTemaByNombre = (
  nombre: string,
): { carrera: ICarrera; asignatura: IAsignatura; tema: ITema } | undefined => {
  for (const carrera of carreras) {
    for (const asignatura of carrera.asignaturas) {
      const tema = asignatura.temas.find((t) =>
        t.nombre.toLowerCase().includes(nombre.toLowerCase()),
      );
      if (tema) {
        return { carrera, asignatura: asignatura, tema: tema };
      }
    }
  }
  return undefined;
};
