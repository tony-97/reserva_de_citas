export type StatusType = 'confirmada' | 'pendiente' | 'cancelada';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    confirmada: 'bg-green-100 text-green-800 border-green-200',
    pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
    cancelada: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${styles[status]}`}>
      <span className="capitalize">{status}</span>
    </span>
  );
}
