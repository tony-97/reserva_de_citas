import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DataTable, Button, Modal, Input } from '@/components/ui';
import { api } from '@/api/endpoints';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Tab = 'medicos' | 'pacientes' | 'especialidades';

const medicoSchema = z.object({
  nombre: z.string().min(2, 'Obligatorio'),
  colegiatura: z.string().min(2, 'Obligatorio'),
  password: z.string().optional(),
  especialidadId: z.string().min(1, 'Obligatorio'),
  estado: z.string().min(1, 'Obligatorio')
});

const pacienteSchema = z.object({
  nombres: z.string().min(2, 'Obligatorio'),
  apellidos: z.string().min(2, 'Obligatorio'),
  dni: z.string().length(8, 'Debe tener 8 dígitos'),
  telefono: z.string().min(6, 'Inválido'),
  correo: z.string().email('Inválido'),
  password: z.string().optional()
});

const especialidadSchema = z.object({
  nombre: z.string().min(2, 'Obligatorio')
});

type MedicoFormType = z.infer<typeof medicoSchema>;
type PacienteFormType = z.infer<typeof pacienteSchema>;
type EspecialidadFormType = z.infer<typeof especialidadSchema>;

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('medicos');

  const [medicos, setMedicos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const medicoFormMethods = useForm<MedicoFormType>({ resolver: zodResolver(medicoSchema), defaultValues: { estado: 'Activo' } });
  const pacienteFormMethods = useForm<PacienteFormType>({ resolver: zodResolver(pacienteSchema) });
  const especialidadFormMethods = useForm<EspecialidadFormType>({ resolver: zodResolver(especialidadSchema) });

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    Promise.all([
      api.admin.medicos.list(),
      api.admin.pacientes.list(),
      api.admin.especialidades.list(),
    ])
      .then(([medicosData, pacientesData, especialidadesData]) => {
        setMedicos(medicosData);
        setPacientes(pacientesData);
        setEspecialidades(especialidadesData);
      })
      .catch(err => setError(err.message || 'Error al cargar los datos'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  /* ── Handlers ── */

  const openCreate = () => {
    setEditingItem(null);
    medicoFormMethods.reset({ nombre: '', colegiatura: '', password: '', especialidadId: '', estado: 'Activo' });
    pacienteFormMethods.reset({ nombres: '', apellidos: '', dni: '', telefono: '', correo: '', password: '' });
    especialidadFormMethods.reset({ nombre: '' });
    setIsFormModalOpen(true);
  };

  const openEdit = (row: any) => {
    setEditingItem(row);
    if (activeTab === 'medicos') {
      medicoFormMethods.reset({
        nombre: row.nombre,
        colegiatura: row.colegiatura,
        password: '',
        especialidadId: row.especialidadId.toString(),
        estado: row.estado,
      });
    } else if (activeTab === 'pacientes') {
      pacienteFormMethods.reset({
        nombres: row.nombres,
        apellidos: row.apellidos,
        dni: row.dni,
        telefono: row.telefono,
        correo: row.correo,
        password: '',
      });
    } else {
      especialidadFormMethods.reset({ nombre: row.nombre });
    }
    setIsFormModalOpen(true);
  };

  const openDelete = (row: any) => {
    setDeletingItem(row);
    setIsDeleteModalOpen(true);
  };

  const onSubmitMedico = async (data: MedicoFormType) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: any = { ...data, especialidadId: Number(data.especialidadId) };
      if (!data.password) delete payload.password;
      if (editingItem) await api.admin.medicos.update(editingItem.id, payload);
      else await api.admin.medicos.create(payload);
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) { setError(err.message || 'Error al guardar'); } 
    finally { setIsSubmitting(false); }
  };

  const onSubmitPaciente = async (data: PacienteFormType) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: any = { ...data };
      if (!data.password) delete payload.password;
      if (editingItem) await api.admin.pacientes.update(editingItem.id, payload);
      else await api.admin.pacientes.create(payload);
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) { setError(err.message || 'Error al guardar'); } 
    finally { setIsSubmitting(false); }
  };

  const onSubmitEspecialidad = async (data: EspecialidadFormType) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!editingItem) await api.admin.especialidades.create(data);
      setIsFormModalOpen(false);
      loadData();
    } catch (err: any) { setError(err.message || 'Error al guardar'); } 
    finally { setIsSubmitting(false); }
  };

  const handleModalConfirm = () => {
    if (activeTab === 'medicos') medicoFormMethods.handleSubmit(onSubmitMedico)();
    else if (activeTab === 'pacientes') pacienteFormMethods.handleSubmit(onSubmitPaciente)();
    else especialidadFormMethods.handleSubmit(onSubmitEspecialidad)();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (activeTab === 'medicos') {
        await api.admin.medicos.delete(deletingItem.id);
      } else if (activeTab === 'pacientes') {
        await api.admin.pacientes.delete(deletingItem.id);
      } else {
        await api.admin.especialidades.delete(deletingItem.id);
      }
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Columns ── */

  const medicoCols = [
    { header: 'Médico', accessor: (row: any) => <span className="font-semibold">{row.nombre}</span> },
    { header: 'Especialidad', accessor: (row: any) => row.especialidad?.nombre || '-' },
    { header: 'CMP', accessor: 'colegiatura' as const },
    {
      header: 'Estado', accessor: (row: any) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
          {row.estado}
        </span>
      ),
    },
  ];

  const pacienteCols = [
    { header: 'DNI', accessor: (row: any) => <span className="font-mono bg-slate-100 px-2 py-1 rounded">{row.dni}</span> },
    { header: 'Paciente', accessor: (row: any) => <span className="font-semibold">{row.nombres} {row.apellidos}</span> },
    { header: 'Teléfono', accessor: 'telefono' as const },
    { header: 'Fecha Registro', accessor: (row: any) => new Date(row.createdAt).toLocaleDateString() },
  ];

  const especialidadCols = [
    { header: 'Nombre', accessor: (row: any) => <span className="font-semibold">{row.nombre}</span> },
    {
      header: 'Médicos', accessor: (row: any) => (
        <span className="text-slate-500">{row.medicos?.length ?? 0} médico(s)</span>
      ),
    },
  ];

  /* ── Tab names ── */

  const tabLabel: Record<Tab, string> = {
    medicos: 'Médicos del Staff',
    pacientes: 'Pacientes Registrados',
    especialidades: 'Especialidades',
  };

  const createLabel: Record<Tab, string> = {
    medicos: '+ Nuevo Médico',
    pacientes: '+ Nuevo Paciente',
    especialidades: '+ Nueva Especialidad',
  };

  /* ── Render ── */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Administración</h1>
          <p className="text-slate-500 mt-2">Gestión central del sistema hospitalario.</p>
        </div>
        <Button onClick={openCreate}>
          {createLabel[activeTab]}
        </Button>
      </div>

      <div className="mb-6 flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(Object.keys(tabLabel) as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Cargando directorio...</div>
        ) : activeTab === 'medicos' ? (
          <DataTable data={medicos} columns={medicoCols} keyExtractor={r => r.id.toString()} onEdit={openEdit} onDelete={openDelete} />
        ) : activeTab === 'pacientes' ? (
          <DataTable data={pacientes} columns={pacienteCols} keyExtractor={r => r.id.toString()} onEdit={openEdit} onDelete={openDelete} />
        ) : (
          <DataTable data={especialidades} columns={especialidadCols} keyExtractor={r => r.id.toString()} onDelete={openDelete} />
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingItem ? `Editar ${activeTab === 'medicos' ? 'Médico' : activeTab === 'pacientes' ? 'Paciente' : 'Especialidad'}` : `Nuev${activeTab === 'especialidades' ? 'a' : 'o'} ${activeTab === 'medicos' ? 'Médico' : activeTab === 'pacientes' ? 'Paciente' : 'Especialidad'}`}
        confirmText={editingItem ? 'Guardar Cambios' : 'Crear'}
        onConfirm={handleModalConfirm}
      >
        <div className="space-y-4 py-2">
          {activeTab === 'medicos' && (
            <form className="space-y-4">
              <Input label="Nombre Completo" {...medicoFormMethods.register('nombre')} error={medicoFormMethods.formState.errors.nombre?.message} required />
              <Input label="CMP / Colegiatura" {...medicoFormMethods.register('colegiatura')} error={medicoFormMethods.formState.errors.colegiatura?.message} required />
              <Input label="Contraseña" type="password" {...medicoFormMethods.register('password')} error={medicoFormMethods.formState.errors.password?.message} placeholder={editingItem ? 'Dejar vacío para mantener' : ''} />
              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Especialidad <span className="text-red-500">*</span></label>
                <select {...medicoFormMethods.register('especialidadId')} required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                  <option value="">Seleccione...</option>
                  {especialidades.map(e => <option key={e.id} value={e.id.toString()}>{e.nombre}</option>)}
                </select>
                {medicoFormMethods.formState.errors.especialidadId && <p className="mt-1 text-sm text-red-600">{medicoFormMethods.formState.errors.especialidadId.message}</p>}
              </div>
              <div className="w-full">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
                <select {...medicoFormMethods.register('estado')}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                  <option value="Activo">Activo</option>
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                {medicoFormMethods.formState.errors.estado && <p className="mt-1 text-sm text-red-600">{medicoFormMethods.formState.errors.estado.message}</p>}
              </div>
            </form>
          )}
          {activeTab === 'pacientes' && (
            <form className="space-y-4">
              <Input label="Nombres" {...pacienteFormMethods.register('nombres')} error={pacienteFormMethods.formState.errors.nombres?.message} required />
              <Input label="Apellidos" {...pacienteFormMethods.register('apellidos')} error={pacienteFormMethods.formState.errors.apellidos?.message} required />
              <Input label="DNI" {...pacienteFormMethods.register('dni')} error={pacienteFormMethods.formState.errors.dni?.message} required />
              <Input label="Teléfono" {...pacienteFormMethods.register('telefono')} error={pacienteFormMethods.formState.errors.telefono?.message} required />
              <Input label="Correo Electrónico" type="email" {...pacienteFormMethods.register('correo')} error={pacienteFormMethods.formState.errors.correo?.message} required />
              <Input label="Contraseña" type="password" {...pacienteFormMethods.register('password')} error={pacienteFormMethods.formState.errors.password?.message} placeholder={editingItem ? 'Dejar vacío para mantener' : ''} />
            </form>
          )}
          {activeTab === 'especialidades' && (
            <form className="space-y-4">
              <Input label="Nombre de la Especialidad" {...especialidadFormMethods.register('nombre')} error={especialidadFormMethods.formState.errors.nombre?.message} required />
            </form>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive
        onConfirm={handleDelete}
      >
        <p className="text-slate-600 py-2">
          ¿Está seguro de eliminar{' '}
          {activeTab === 'medicos' ? 'al médico' : activeTab === 'pacientes' ? 'al paciente' : 'la especialidad'}{' '}
          <span className="font-semibold text-slate-900">
            {deletingItem?.nombre || deletingItem?.nombres + ' ' + (deletingItem?.apellidos || '')}
          </span>?
          {activeTab === 'especialidades' && (
            <span className="block mt-2 text-sm text-red-600">Esta acción también eliminará los médicos asociados.</span>
          )}
        </p>
      </Modal>
    </div>
  );
}
