import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/endpoints';
import type { CitaAPI, CitaUI } from '../@types/cita';

// Helpers
export const mapCitaFromAPI = (cita: CitaAPI): CitaUI => {
  return {
    id: cita.id.toString(),
    fecha: new Date(cita.fecha).toISOString().split('T')[0],
    hora: cita.hora,
    medico: cita.medico?.nombre || 'Desconocido',
    especialidad: cita.especialidad?.nombre || 'Desconocida',
    paciente: cita.paciente ? `${cita.paciente.nombres} ${cita.paciente.apellidos}` : 'Desconocido',
    estado: cita.estado,
    motivo: 'Consulta General', 
    historial: 'Sin antecedentes registrados',
    observaciones: cita.observaciones || '',
    noShow: cita.noShow || false
  };
};

export const mapCitaToAPI = (citaUI: Partial<CitaUI>, overrides: any = {}) => {
  return {
    fecha: citaUI.fecha ? new Date(citaUI.fecha).toISOString() : undefined,
    hora: citaUI.hora,
    estado: citaUI.estado,
    ...overrides
  };
};

export function useCitas(params?: Record<string, string | number>) {
  const queryClient = useQueryClient();

  const { data: citas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['citas', params],
    queryFn: async () => {
      const response = await api.citas.list(params) as any;
      const list: CitaAPI[] = Array.isArray(response) ? response : (response.data || []);
      return list.map(mapCitaFromAPI);
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.citas.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['citas'] })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.citas.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['citas'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.citas.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['citas'] })
  });

  return {
    citas,
    isLoading: isLoading || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error: error ? error.message : null,
    fetchCitas: refetch,
    createCita: createMutation.mutateAsync,
    updateCita: async (id: number, data: any) => { await updateMutation.mutateAsync({ id, data }); return true; },
    deleteCita: async (id: number) => { await deleteMutation.mutateAsync(id); return true; }
  };
}

export function useCitasHoy(medicoId: number) {
  const queryClient = useQueryClient();

  const { data: citas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['citas-hoy', medicoId],
    queryFn: async () => {
      const response = await api.citas.hoy(medicoId) as any;
      const list: CitaAPI[] = Array.isArray(response) ? response : (response.data || []);
      return list.map(mapCitaFromAPI);
    },
    enabled: !!medicoId
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.citas.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['citas-hoy'] })
  });

  return {
    citas,
    isLoading: isLoading || updateMutation.isPending,
    error: error ? error.message : null,
    fetchCitas: refetch,
    updateCita: async (id: number, data: any) => { await updateMutation.mutateAsync({ id, data }); return true; }
  };
}
