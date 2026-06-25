import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const hash = (pw: string) => bcrypt.hashSync(pw, 10);

async function main() {
  console.log('Seeding database...');

  const e1 = await prisma.especialidad.upsert({ where: { nombre: 'Medicina General' }, update: {}, create: { nombre: 'Medicina General' } });
  const e2 = await prisma.especialidad.upsert({ where: { nombre: 'Cardiología' }, update: {}, create: { nombre: 'Cardiología' } });
  const e3 = await prisma.especialidad.upsert({ where: { nombre: 'Pediatría' }, update: {}, create: { nombre: 'Pediatría' } });
  const e4 = await prisma.especialidad.upsert({ where: { nombre: 'Dermatología' }, update: {}, create: { nombre: 'Dermatología' } });

  const m1 = await prisma.medico.upsert({ where: { colegiatura: 'CMP 12345' }, update: {}, create: { nombre: 'Dr. Juan Pérez', colegiatura: 'CMP 12345', password: hash('123456'), especialidadId: e1.id, estado: 'Activo' } });
  const m2 = await prisma.medico.upsert({ where: { colegiatura: 'CMP 23456' }, update: {}, create: { nombre: 'Dra. María Gómez', colegiatura: 'CMP 23456', password: hash('123456'), especialidadId: e1.id, estado: 'Activo' } });
  const m3 = await prisma.medico.upsert({ where: { colegiatura: 'CMP 34567' }, update: {}, create: { nombre: 'Dr. Carlos Ramírez', colegiatura: 'CMP 34567', password: hash('123456'), especialidadId: e2.id, estado: 'Vacaciones' } });
  const m4 = await prisma.medico.upsert({ where: { colegiatura: 'CMP 45678' }, update: {}, create: { nombre: 'Dra. Ana Torres', colegiatura: 'CMP 45678', password: hash('123456'), especialidadId: e3.id, estado: 'Activo' } });
  const m5 = await prisma.medico.upsert({ where: { colegiatura: 'CMP 56789' }, update: {}, create: { nombre: 'Dr. Luis Castro', colegiatura: 'CMP 56789', password: hash('123456'), especialidadId: e4.id, estado: 'Activo' } });

  const p1 = await prisma.paciente.upsert({ where: { dni: '12345678' }, update: {}, create: { nombres: 'Carlos', apellidos: 'Mendoza', dni: '12345678', telefono: '987654321', correo: 'carlos@example.com', password: hash('123456') } });
  const p2 = await prisma.paciente.upsert({ where: { dni: '87654321' }, update: {}, create: { nombres: 'Laura', apellidos: 'Quispe', dni: '87654321', telefono: '912345678', correo: 'laura@example.com', password: hash('123456') } });

  await prisma.cita.deleteMany({});
  await prisma.cita.create({ data: { pacienteId: p1.id, medicoId: m1.id, especialidadId: e1.id, fecha: new Date('2026-06-25T00:00:00Z'), hora: '10:00', estado: 'confirmada', estadoPago: 'Pagado', metodoPago: 'tarjeta', transaccionId: 'TRX-10000001' } });
  await prisma.cita.create({ data: { pacienteId: p2.id, medicoId: m4.id, especialidadId: e3.id, fecha: new Date('2026-07-02T00:00:00Z'), hora: '15:30', estado: 'pendiente', estadoPago: 'Pendiente' } });
  await prisma.cita.create({ data: { pacienteId: p1.id, medicoId: m3.id, especialidadId: e2.id, fecha: new Date('2026-05-15T00:00:00Z'), hora: '09:00', estado: 'cancelada', estadoPago: 'Rechazado', metodoPago: 'tarjeta', transaccionId: 'TRX-10000002' } });

  console.log('Seed exitoso');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
