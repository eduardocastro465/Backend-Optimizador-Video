import { Resend } from "resend";
import { randomInt } from "crypto";
import { throwError } from "../utils/asyncHandler.js";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const generarCodigo = () => {
  return randomInt(100000, 999999).toString();
};

export async function sendEmail(email: string, token: string) {
  try {
   await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Tu código de verificación — OPTIMIZADOR_VIDEOS",
      html: `
    <div style="font-family: -apple-system, 'Segoe UI', sans-serif; background-color: #07070f; padding: 40px 20px; min-height: 100vh;">
      <div style="max-width: 480px; margin: auto; background-color: #0b0b16; border-radius: 16px; overflow: hidden; border: 1px solid rgba(192,132,252,0.15);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, rgba(192,132,252,0.13) 0%, rgba(124,58,237,0.07) 100%); padding: 28px 32px 24px; border-bottom: 1px solid rgba(192,132,252,0.1);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: rgba(192,132,252,0.15); border-radius: 8px; border: 1px solid rgba(192,132,252,0.3); display: flex; align-items: center; justify-content: center;">
              <!-- Icono escudo inline para máxima compatibilidad -->
              <span style="font-size: 16px;">🔐</span>
            </div>
            <span style="color: #c084fc; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">Verificación de cuenta</span>
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 12px; line-height: 1.3;">
            Confirma tu identidad
          </h2>
          <p style="color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.7; margin: 0 0 28px;">
            Usa el siguiente código para verificar tu cuenta. Es de un solo uso y expira en breve.
          </p>

          <!-- Código -->
          <div style="background: rgba(192,132,252,0.08); border: 1px solid rgba(192,132,252,0.25); border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 24px;">
            <p style="color: rgba(255,255,255,0.35); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Tu código de verificación</p>
            <div style="font-size: 44px; font-weight: 800; letter-spacing: 16px; color: #c084fc; font-family: 'Courier New', Courier, monospace; line-height: 1;">
              ${token}
            </div>
            <p style="color: rgba(255,255,255,0.25); font-size: 12px; margin: 16px 0 0;">
              Válido por <span style="color: rgba(192,132,252,0.7);">10 minutos</span>
            </p>
          </div>

          <!-- Aviso -->
          <div style="border-left: 2px solid rgba(192,132,252,0.4); padding: 10px 14px; margin-bottom: 24px; background: rgba(192,132,252,0.05); border-radius: 0 8px 8px 0;">
            <p style="color: rgba(255,255,255,0.35); font-size: 12px; margin: 0; line-height: 1.6;">
              Si no solicitaste este código, puedes ignorar este correo. Tu cuenta permanece segura.
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: rgba(255,255,255,0.2); font-size: 12px;">✦ OPTIMIZADOR_VIDEOS</span>
            <span style="color: rgba(255,255,255,0.15); font-size: 11px;">No respondas a este correo</span>
          </div>
        </div>
      </div>
    </div>
  `,
    });
  } catch {
    throwError(ERROR_MESSAGES.CORREO_NO_ENVIADO, 500);
  }
}
