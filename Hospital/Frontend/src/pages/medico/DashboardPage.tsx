import { useState, useEffect } from 'react';
import { DataTable, StatusBadge } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import { useCitas } from '../../hooks/useCitas';
import type { CitaUI } from '../../@types/cita';

export function DashboardPage() {
  const { citas, isLoading, error, fetchCitas } = useCitas();
  const [selectedPaciente, setSelectedPaciente] = useState<CitaUI | null>(null);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  useEffect(() => {
    if (citas.length > 0 && !selectedPaciente) {
      setSelectedPaciente(citas[0]);
    }
  }, [citas]);

  const columns = [
    { header: 'Hora', accessor: (row: CitaUI) => <span className="font-semibold">{row.hora}</span> },
    { header: 'Paciente', accessor: 'paciente' as const },
    { header: 'Estado', accessor: (row: CitaUI) => <StatusBadge status={row.estado} /> }
  ] as const satisfies Column<CitaUI>[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-900">Portal Médico</h1>
        <p className="text-slate-500 mt-2">Bienvenido. Estas son las citas programadas en el sistema.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Citas Programadas</h2>
          {isLoading ? (
            <div className="text-center py-12 text-slate-500">Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
              No hay citas programadas para mostrar.
            </div>
          ) : (
            <>
              <div className="cursor-pointer">
                <DataTable
                  data={citas}
                  columns={columns}
                  keyExtractor={row => row.id}
                  onEdit={(row) => setSelectedPaciente(row)}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">* Use el botón "Editar" para seleccionar un paciente y ver su historia clínica.</p>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-24 overflow-hidden flex flex-col h-[calc(100vh-120px)]">
            <div className="bg-slate-50 border-b border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-slate-800">Detalle del Paciente</h2>
            </div>
            
            {selectedPaciente ? (
              <div className="p-6 flex-grow overflow-y-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-2xl font-bold">
                    {selectedPaciente.paciente.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedPaciente.paciente}</h3>
                    <StatusBadge status={selectedPaciente.estado} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Cita Actual</h4>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-sm"><span className="font-medium">Especialidad:</span> {selectedPaciente.especialidad}</p>
                      <p className="text-sm mt-1"><span className="font-medium">Fecha y Hora:</span> {selectedPaciente.fecha} a las {selectedPaciente.hora}</p>
                      <p className="text-sm mt-1"><span className="font-medium">Motivo:</span> Consulta General</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Historial Clínico</h4>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-slate-800 leading-relaxed">
                      Sin antecedentes registrados previamente.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-full text-slate-400 text-center">
                Seleccione un paciente de la lista para ver sus detalles.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
