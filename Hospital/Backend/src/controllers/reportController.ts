import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import PDFDocument from 'pdfkit';
import { parse } from 'json2csv';

export const reportController = {
  async exportPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const citas = await prisma.cita.findMany({
        include: { paciente: true, medico: true, especialidad: true },
        orderBy: { fecha: 'desc' }
      });

      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.pdf');
      doc.pipe(res);

      doc.fontSize(20).text('Reporte de Citas Médicas', { align: 'center' });
      doc.moveDown();

      citas.forEach(cita => {
        doc.fontSize(12).text(`Fecha: ${cita.fecha.toISOString().split('T')[0]} ${cita.hora}`);
        doc.text(`Paciente: ${cita.paciente.nombres} ${cita.paciente.apellidos}`);
        doc.text(`Médico: ${cita.medico.nombre} (${cita.especialidad.nombre})`);
        doc.text(`Estado: ${cita.estado} | No-Show: ${cita.noShow ? 'Sí' : 'No'}`);
        doc.moveDown();
      });

      doc.end();
    } catch (e) { next(e); }
  },

  async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const citas = await prisma.cita.findMany({
        include: { paciente: true, medico: true, especialidad: true },
        orderBy: { fecha: 'desc' }
      });

      const data = citas.map(c => ({
        ID: c.id,
        Fecha: c.fecha.toISOString().split('T')[0],
        Hora: c.hora,
        Paciente: `${c.paciente.nombres} ${c.paciente.apellidos}`,
        Medico: c.medico.nombre,
        Especialidad: c.especialidad.nombre,
        Estado: c.estado,
        EstadoPago: c.estadoPago,
        NoShow: c.noShow ? 'Si' : 'No',
        Observaciones: c.observaciones || ''
      }));

      const csv = parse(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.csv');
      res.send(csv);
    } catch (e) { next(e); }
  }
};
