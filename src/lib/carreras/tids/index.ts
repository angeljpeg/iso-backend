import { ICarrera } from '@interfaces/carrera.interface';
import AsignaturasTIDS from './asignaturas';

export * from './asignaturas';

export const TIDS: ICarrera = {
  nombre: 'TECNOLOGÍAS DE LA INFORMACIÓN Y DESARROLLO DE SOFTWARE',
  codigo: 'TIDS',
  asignaturas: AsignaturasTIDS,
};
