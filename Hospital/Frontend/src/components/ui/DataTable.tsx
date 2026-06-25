import { type ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({ columns, data, onEdit, onDelete, keyExtractor }: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200">No hay datos para mostrar.</div>;
  }

  return (
    <div className="w-full">
      {/* Mobile view: Stacked Cards */}
      <div className="block md:hidden space-y-4">
        {data.map((row) => (
          <div key={keyExtractor(row)} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="space-y-3 mb-4">
              {columns.map((col, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold text-slate-500 uppercase">{col.header}</span>
                  <span className="text-sm text-slate-900 mt-1 sm:mt-0 sm:text-right font-medium">
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor as keyof T] as ReactNode)}
                  </span>
                </div>
              ))}
            </div>
            {(onEdit || onDelete) && (
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                {onEdit && (
                  <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors">
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor as keyof T] as ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors">
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-900 transition-colors">
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
