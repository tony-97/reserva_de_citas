import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, templateString: string, context: any) => {
  try {
    const template = handlebars.compile(templateString);
    const html = template(context);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const emailTemplates = {
  resetPassword: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hola {{nombre}},</h2>
      <p>Has solicitado restablecer tu contraseña en el sistema de Citas Médicas.</p>
      <p>Haz clic en el siguiente enlace para continuar (este enlace expira en 15 minutos):</p>
      <a href="{{resetUrl}}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
      <p>Si no solicitaste esto, puedes ignorar este correo de forma segura.</p>
    </div>
  `,
  citaConfirmacion: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Confirmación de Cita</h2>
      <p>Hola {{nombre}}, tu cita ha sido confirmada.</p>
      <ul>
        <li><strong>Especialidad:</strong> {{especialidad}}</li>
        <li><strong>Fecha:</strong> {{fecha}}</li>
        <li><strong>Hora:</strong> {{hora}}</li>
      </ul>
      <p>Te esperamos puntualmente.</p>
    </div>
  `
};
