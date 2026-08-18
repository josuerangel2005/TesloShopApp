import { EmailMessage } from "../../domain/model/email-message";

export function invoiceEmail(
  to: string,
  invoiceNumber: string,
  invoiceUrl: string,
): EmailMessage {
  const html = `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tu factura ${invoiceNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #274494; padding: 24px 32px;">
                  <span style="color: #ffffff; font-family: 'Montserrat Alternates', 'Segoe UI', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px;">
                    Teslo | Shop
                  </span>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px 32px 40px;">
                  <h1 style="margin: 0 0 16px; color: #1d356e; font-family: 'Montserrat Alternates', 'Segoe UI', sans-serif; font-size: 24px; font-weight: 700;">
                    Tu factura está lista
                  </h1>
                  <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Hola, la factura <strong>${invoiceNumber}</strong> de tu compra en Teslo Shop
                    ya está disponible para descargar. Haga clic en el botón de abajo para verla.
                  </p>

                  <!-- Invoice button -->
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                    <tr>
                      <td align="center" style="border-radius: 8px; background-color: #274494;">
                        <a href="${invoiceUrl}" style="display: inline-block; padding: 14px 32px; color: #ffffff; background-color: #274494; text-decoration: none; font-family: 'Inter', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; border-radius: 8px;">
                          Ver mi factura
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                    Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                  </p>
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; word-break: break-all;">
                    <a href="${invoiceUrl}" style="color: #3d5db8; text-decoration: underline;">${invoiceUrl}</a>
                  </p>

                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 24px;" />
                  <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5;">
                    Este correo contiene un enlace de descarga de tu factura. Si no realizaste una compra,
                    contactate con soporte de Teslo Shop.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return new EmailMessage(
    to,
    `Tu factura ${invoiceNumber} de Teslo Shop`,
    html,
  );
}
