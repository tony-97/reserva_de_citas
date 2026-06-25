import type { Paciente } from './paciente';
import type { Medico, Especialidad } from './medico';

export interface CitaAPI {
  id: number;
  pacienteId: number;
  medicoId: number;
  especialidadId: number;
  fecha: string;
  hora: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  paciente?: Paciente;
  medico?: Medico;
  especialidad?: Especialidad;
}

export interface CitaUI {
  id: string;
  fecha: string;
  hora: string;
  medico: string;
  especialidad: string;
  paciente: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  motivo?: string;
  historial?: string;
}
