import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo Estudify.ai recopila, usa y protege tu información personal.",
};

const sections = [
  {
    title: "1. Información que recopilamos",
    content: `Recopilamos la información que tú nos proporcionas directamente:

• Información de cuenta: nombre, correo electrónico y contraseña al registrarte.
• Material de estudio: archivos (PDFs, imágenes, texto) que subes para generar resúmenes y exámenes.
• Datos de uso: interacciones con la plataforma, respuestas a quizzes, puntuaciones de Exam Readiness Score.
• Información de pago: procesada de forma segura por Stripe. Estudify no almacena datos de tarjetas.`,
  },
  {
    title: "2. Cómo usamos tu información",
    content: `Usamos tu información para:

• Proveer y mejorar el servicio de Estudify.ai.
• Generar resúmenes, flashcards y exámenes basados en tu material.
• Calcular y mostrarte tu Exam Readiness Score.
• Enviarte avisos del producto (lanzamiento, actualizaciones). Puedes cancelar en cualquier momento.
• Cumplir obligaciones legales.

No vendemos ni compartimos tu información personal con terceros con fines comerciales.`,
  },
  {
    title: "3. Almacenamiento y seguridad",
    content: `Tu privacidad es una prioridad:

• Los archivos que subes se encriptan en tránsito (TLS) y en reposo (AES-256).
• Los archivos se eliminan automáticamente después de 30 días, salvo que tú los elimines antes.
• Tu información se almacena en servidores seguros provistos por Supabase con infraestructura en AWS.
• Aplicamos principios de mínimo privilegio: solo el personal autorizado puede acceder a datos necesarios para soporte técnico.`,
  },
  {
    title: "4. Cookies y tecnologías similares",
    content: `Usamos cookies propias para:

• Mantener tu sesión activa.
• Recordar tus preferencias.
• Medir el rendimiento de la plataforma (analytics anónimos).

No usamos cookies de terceros con fines publicitarios.`,
  },
  {
    title: "5. Tus derechos",
    content: `Tienes derecho a:

• Acceder a los datos personales que tenemos sobre ti.
• Solicitar la corrección de datos incorrectos.
• Solicitar la eliminación de tu cuenta y datos asociados.
• Portabilidad de datos: recibir una copia de tu información en formato legible.
• Retirar tu consentimiento para comunicaciones de marketing en cualquier momento.

Para ejercer cualquiera de estos derechos, escríbenos a hola@estudify.ai.`,
  },
  {
    title: "6. Menores de edad (COPPA)",
    content: `Estudify.ai es una plataforma para estudiantes de secundaria, preparatoria y universidad. Para usuarios menores de 13 años, requerimos consentimiento verificable del padre o tutor legal.

Si eres padre o tutor y crees que tu hijo menor de 13 años nos ha proporcionado información sin tu consentimiento, contáctanos a hola@estudify.ai para eliminarla inmediatamente.`,
  },
  {
    title: "7. Cambios a esta política",
    content: `Podemos actualizar esta política periódicamente. Te notificaremos por correo electrónico con al menos 15 días de anticipación ante cambios materiales. El uso continuado del servicio después de la fecha efectiva constituye aceptación de la política actualizada.`,
  },
  {
    title: "8. Contacto",
    content: `Si tienes preguntas sobre esta política o sobre el manejo de tus datos:

Email: hola@estudify.ai
Estudify.ai — Ciudad de México, México`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-24 px-6 md:px-8">
        <div className="max-w-[720px] mx-auto">
          <div className="mb-10">
            <Link
              href="/"
              className="text-[13px] text-[var(--text2)] hover:text-white transition-colors inline-flex items-center gap-1.5 mb-8"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Volver al inicio
            </Link>

            <div className="text-[12px] font-semibold text-[var(--purple-light)] uppercase tracking-[0.12em] mb-4">
              Legal
            </div>
            <h1 className="text-[34px] md:text-[44px] font-black text-white tracking-[-0.03em] leading-[1.05] mb-3">
              Política de Privacidad
            </h1>
            <p className="text-[14px] text-[var(--text2)]">
              Última actualización: abril 2026
            </p>
          </div>

          <div className="prose-custom space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-[17px] font-bold text-white mb-3 tracking-tight">
                  {s.title}
                </h2>
                <div className="text-[14.5px] text-[var(--text2)] leading-[1.7] whitespace-pre-line">
                  {s.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
