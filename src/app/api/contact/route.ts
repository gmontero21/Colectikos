import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';

// Fuerza a Node.js a priorizar IPv4. Esto soluciona problemas de conexión 
// cuando el sistema intenta usar IPv6 (que frecuentemente falla con EHOSTUNREACH)
dns.setDefaultResultOrder('ipv4first');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, motivo, comentarios } = body;

    // Validate required fields
    if (!nombre || !email || !comentarios) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, email, comentarios)' },
        { status: 400 }
      );
    }

    // Ensure environment variables are loaded
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
      console.error('Missing SMTP environment variables');
      return NextResponse.json(
        { error: 'Configuración del servidor de correo incompleta' },
        { status: 500 }
      );
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
      connectionTimeout: 10000, // 10 seconds max to connect
      socketTimeout: 15000, // 15 seconds max for inactivity
    });

    const mailOptions = {
      from: `"${nombre}" <${SMTP_USER}>`, // Usually sender must be the authenticated user
      replyTo: email,
      to: 'contacto@gemadigitalcr.com',
      subject: `Nuevo mensaje de Colectikos: ${motivo}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono || 'No proporcionado'}\nMotivo: ${motivo}\n\nMensaje:\n${comentarios}`,
      html: `
        <h3>Nuevo mensaje de contacto desde Colectikos</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <br/>
        <p><strong>Mensaje:</strong></p>
        <p>${comentarios.replace(/\n/g, '<br/>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error enviando correo:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al enviar el mensaje' },
      { status: 500 }
    );
  }
}
