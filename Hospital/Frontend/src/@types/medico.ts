export interface Especialidad {
  id: number;
  nombre: string;
}

export interface Medico {
  id: number;
  nombre: string;
  colegiatura: string;
  especialidadId: number;
  especialidad?: Especialidad;
  estado: string;
  createdAt?: string;
}
