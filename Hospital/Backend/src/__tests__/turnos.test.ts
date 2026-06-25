import { describe, it, expect } from 'vitest';

const DIAS_LABORALES = [1, 2, 3, 4, 5];
const HORA_INICIO = 8;
const HORA_FIN = 14;
const INTERVALO_MIN = 30;

function generarSlots(fecha: string): string[] {
  const slots: string[] = [];
  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    for (let m = 0; m < 60; m += INTERVALO_MIN) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

function esFindeSemana(fechaStr: string): boolean {
  const fecha = new Date(fechaStr + 'T00:00:00Z');
  return !DIAS_LABORALES.includes(fecha.getUTCDay());
}

function slotsDisponibles(todosSlots: string[], horasOcupadas: Set<string>): string[] {
  return todosSlots.filter(s => !horasOcupadas.has(s));
}

describe('Turnos - Slot Generation', () => {
  it('should generate 12 slots for a full day (8am-2pm, 30min intervals)', () => {
    const slots = generarSlots('2026-07-01');
    expect(slots).toHaveLength(12);
  });

  it('should start at 08:00 and end at 13:30', () => {
    const slots = generarSlots('2026-07-01');
    expect(slots[0]).toBe('08:00');
    expect(slots[slots.length - 1]).toBe('13:30');
  });

  it('should have correct 30min interval slots', () => {
    const slots = generarSlots('2026-07-01');
    const expected = [
      '08:00', '08:30', '09:00', '09:30',
      '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30'
    ];
    expect(slots).toEqual(expected);
  });

  it('should return same slots regardless of date', () => {
    const slots1 = generarSlots('2026-07-01');
    const slots2 = generarSlots('2026-12-25');
    expect(slots1).toEqual(slots2);
  });
});

describe('Turnos - Weekday Validation', () => {
  it('should identify Monday (2026-06-29) as a laboral day', () => {
    expect(esFindeSemana('2026-06-29')).toBe(false);
  });

  it('should identify Friday (2026-07-03) as a laboral day', () => {
    expect(esFindeSemana('2026-07-03')).toBe(false);
  });

  it('should identify Saturday (2026-07-04) as weekend', () => {
    expect(esFindeSemana('2026-07-04')).toBe(true);
  });

  it('should identify Sunday (2026-07-05) as weekend', () => {
    expect(esFindeSemana('2026-07-05')).toBe(true);
  });
});

describe('Turnos - Availability Filtering', () => {
  const allSlots = generarSlots('2026-07-01');

  it('should return all slots when none are occupied', () => {
    const available = slotsDisponibles(allSlots, new Set());
    expect(available).toHaveLength(12);
  });

  it('should exclude occupied slots', () => {
    const occupied = new Set(['10:00', '11:30']);
    const available = slotsDisponibles(allSlots, occupied);
    expect(available).toHaveLength(10);
    expect(available).not.toContain('10:00');
    expect(available).not.toContain('11:30');
  });

  it('should return empty when all slots are occupied', () => {
    const occupied = new Set(allSlots);
    const available = slotsDisponibles(allSlots, occupied);
    expect(available).toHaveLength(0);
  });

  it('should not mutate the original slot list', () => {
    const originalLength = allSlots.length;
    slotsDisponibles(allSlots, new Set(['08:00']));
    expect(allSlots).toHaveLength(originalLength);
  });
});
