import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, StatusBadge, Modal, Button } from '../../components/ui';
import type { Column } from '../../components/ui/DataTable';
import type { CitaUI } from '../../@types/cita';
import { useCitas } from '../../hooks/useCitas';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, PlusCircle, Clock, Calendar } from 'lucide-react';

export function MisCitasPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { citas, isLoading, error, fetchCitas, deleteCita, updateCita } = useCitas(user?.id ? { pacienteId: user.id } : { pacienteId: -1 });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [citaToEdit, setCitaToEdit] = useState<any | null>(null);
  const [newFecha, setNewFecha] = useState<Date | null>(null);
  const [newHora, setNewHora] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchCitas();
    }
  }, [fetchCitas, user?.id]);

  const handleDeleteClick = (cita: any) => {
    setCitaToDelete(cita);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (citaToDelete) {
      await deleteCita(Number(citaToDelete.id));
      setCitaToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditClick = (cita: any) => {
    setCitaToEdit(cita);
    setNewFecha(null);
    setNewHora('');
    setHorariosDisponibles([]);
    setIsEditModalOpen(true);
  };

  const handleFechaChange = async (date: Date) => {
    setNewFecha(date);
    // Simular carga de horarios disponibles
    const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    setHorariosDisponibles(horarios);
  };

  const confirmEdit = async () => {
    if (citaToEdit && newFecha && newHora) {
      await updateCita(Number(citaToEdit.id), {
        fecha: newFecha.toISOString(),
        hora: newHora
      });
      setCitaToEdit(null);
      setIsEditModalOpen(false);
      setNewFecha(null);
      setNewHora('');
    }
  };

  const columns = [
    { header: 'Fecha y Hora', accessor: (row: any) => <div className="font-semibold text-slate-900">{row.fecha} <span className="text-slate-500 font-light ml-2 bg-slate-100 px-2 py-1 rounded-md text-sm">{row.hora}</span></div> },
    { header: 'Especialidad', accessor: (row: any) => <span className="text-secondary-600 font-medium">{row.especialidad}</span> },
    { header: 'Médico', accessor: 'medico' as const },
    { header: 'Estado', accessor: (row: any) => <StatusBadge status={row.estado} /> }
  ] as const satisfies Column<CitaUI>[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-secondary-900 tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-primary-500" size={36} /> 
            Mis Citas
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-light">Gestione su historial clínico y citas programadas con facilidad.</p>
        </div>
        <Button onClick={() => navigate('/reservar')} size="lg" className="shadow-lg hover:shadow-xl flex items-center gap-2 px-6">
          <PlusCircle size={20} />
          Nueva Cita
        </Button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 text-red-600 px-6 py-4 rounded-2xl border border-red-200 font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-lg">Cargando sus citas...</p>
        </div>
      ) : citas.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col items-center">
          <CalendarCheck size={64} className="text-slate-200 mb-6" />
          <h3 className="text-2xl font-semibold text-slate-700 mb-2">No tiene citas programadas</h3>
          <p className="text-slate-500 mb-8 max-w-md">Parece que aún no ha reservado ninguna cita médica. ¡Anímese a agendar una ahora mismo!</p>
          <Button onClick={() => navigate('/reservar')} variant="outline" size="lg">
            Ir a Reservar Cita
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <DataTable
            data={citas}
            columns={columns}
            keyExtractor={(row) => row.id}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Cancelar Cita"
        isDestructive={true}
        confirmText="Sí, cancelar cita"
      >
        <div className="text-slate-600 space-y-4">
          <p>¿Está seguro que desea cancelar su cita programada con <strong className="text-slate-900">{citaToDelete?.medico}</strong> para el día <strong className="text-slate-900">{citaToDelete?.fecha}</strong>?</p>
          <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">Esta acción es permanente y la fecha quedará libre para otro paciente.</p>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={confirmEdit}
        title="Reprogramar Cita"
        isDestructive={false}
        confirmText="Confirmar Cambio"
      >
        <div className="text-slate-600 space-y-4">
          <p>Reprogramando cita con <strong className="text-slate-900">{citaToEdit?.medico}</strong> - {citaToEdit?.especialidad}</p>
          <p className="text-sm text-slate-500">Fecha actual: {citaToEdit?.fecha} a las {citaToEdit?.hora}</p>
          
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} /> Nueva Fecha
              </label>
              <input
                type="date"
                value={newFecha ? newFecha.toISOString().split('T')[0] : ''}
                onChange={(e) => handleFechaChange(new Date(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {newFecha && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock size={16} /> Nuevo Horario
                </label>
                <select
                  value={newHora}
                  onChange={(e) => setNewHora(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Seleccione un horario</option>
                  {horariosDisponibles.map((hora) => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
