export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSlotSelect: (id: string) => void;
}

export function TimeSlotGrid({ slots, selectedSlotId, onSlotSelect }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return <div className="text-slate-500 text-center py-4">No hay horarios disponibles.</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {slots.map(slot => (
        <button
          key={slot.id}
          type="button"
          disabled={!slot.available}
          onClick={() => slot.available && onSlotSelect(slot.id)}
          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all text-center
            ${!slot.available 
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
              : selectedSlotId === slot.id
                ? 'bg-primary-500 border-primary-500 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50'}
          `}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
