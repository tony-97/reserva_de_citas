import { fetchClient } from './client';

export const api = {
  auth: {
    login: (data: { identifier: string; password?: string }) => fetchClient('/auth/login', { method: 'POST', body: JSON.stringify(data) })
  },
  pacientes: {
    list: () => fetchClient('/pacientes'),
    getById: (id: number) => fetchClient(`/pacientes/${id}`),
    create: (data: any) => fetchClient('/pacientes', { method: 'POST', body: JSON.stringify(data) }),
  },
  citas: {
    list: (params?: Record<string, string | number>) => {
      const query = params ? new URLSearchParams(params as any).toString() : '';
      return fetchClient(`/citas${query ? `?${query}` : ''}`);
    },
    create: (data: any) => fetchClient('/citas', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetchClient(`/citas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchClient(`/citas/${id}`, { method: 'DELETE' }),
  },
  medicos: {
    list: (especialidadId?: number) => fetchClient(`/medicos${especialidadId ? `?especialidadId=${especialidadId}` : ''}`),
  },
  especialidades: {
    list: () => fetchClient('/especialidades'),
  },
  turnos: {
    disponibles: (medicoId: number, fecha: string) => fetchClient(`/turnos/disponibles?medicoId=${medicoId}&fecha=${fecha}`),
  },
  pagos: {
    checkout: (data: { citaId: number; metodoPago: string }) => fetchClient('/pagos/checkout', { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    medicos: {
      list: () => fetchClient('/admin/medicos'),
      create: (data: any) => fetchClient('/admin/medicos', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: any) => fetchClient(`/admin/medicos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: number) => fetchClient(`/admin/medicos/${id}`, { method: 'DELETE' }),
    },
    pacientes: {
      list: () => fetchClient('/admin/pacientes'),
      create: (data: any) => fetchClient('/admin/pacientes', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: number, data: any) => fetchClient(`/admin/pacientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: number) => fetchClient(`/admin/pacientes/${id}`, { method: 'DELETE' }),
    },
    especialidades: {
      list: () => fetchClient('/admin/especialidades'),
      create: (data: any) => fetchClient('/admin/especialidades', { method: 'POST', body: JSON.stringify(data) }),
      delete: (id: number) => fetchClient(`/admin/especialidades/${id}`, { method: 'DELETE' }),
    },
  },
};
