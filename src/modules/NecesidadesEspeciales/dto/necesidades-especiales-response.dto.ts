export class NecesidadesEspecialesResponseDto {
  id: number;
  fecha: Date;
  nombreAlumno: string;
  numeroMatricula: string;
  programaEducativo: string;
  fechaRevision: Date;
  numeroRevision: number;

  excepcionesConductuales: boolean;
  especificacionConductual?: string;

  excepcionesComunicacionales: boolean;
  especificacionComunicacional?: string;

  excepcionesIntelectuales: boolean;
  especificacionIntelectual?: string;

  excepcionesFisicas: boolean;
  especificacionFisica?: string;

  excepcionesSuperdotacion: boolean;
  especificacionSuperdotacion?: string;

  otrasNecesidades?: string;

  cargaAcademicaId: number;
  createdAt: Date;
  updatedAt: Date;
}
