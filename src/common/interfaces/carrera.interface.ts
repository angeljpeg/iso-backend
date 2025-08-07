export interface ICarrera {
  nombre: string;
  codigo: string;
  asignaturas: IAsignatura[];
}

export interface IAsignatura {
  nombre: string;
  horasProgramadas: number;
  temas: ITema[];
}

export interface ITema {
  nombre: string;
  unidad: number;
  semanaProgramada: number;
}
