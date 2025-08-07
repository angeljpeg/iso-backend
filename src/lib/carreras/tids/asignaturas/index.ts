import { IAsignatura } from '@interfaces/carrera.interface';
import {
  AplicacionesIoT,
  AplicacionesWeb,
  BasesDatosEnLaNube,
  DesarrolloMovil,
  ExpresionOralYEscrita,
  Ingles,
  Integradora,
} from './asignaturas';

export * from './asignaturas';

export const AsignaturasTIDS: IAsignatura[] = [
  AplicacionesIoT,
  DesarrolloMovil,
  Integradora,
  AplicacionesWeb,
  BasesDatosEnLaNube,
  ExpresionOralYEscrita,
  Ingles,
];

export default AsignaturasTIDS;
