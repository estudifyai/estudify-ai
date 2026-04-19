import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description: "Términos y condiciones de uso de Estudify.ai.",
};

const sections = [
  {
    title: "1. Descripción del servicio",
    content: `Estudify.ai es una plataforma de estudio con inteligencia artificial que convierte material educativo (apuntes, PDFs, texto, audio) en resúmenes, flashcards, exámenes de práctica y seguimiento de dominio mediante el Exam Readiness Score.

Estudify.ai es una herramienta de formación, no de suplantación. El servicio está diseñado para ayudarte a aprender y prepararte para exámenes, no para generar respuestas que presentes como propias en trabajos académicos.`,
  },
  {
    title: "2. Aceptación de los términos",
    content: `Al crear una cuenta o usar Estudify.ai, aceptas estos Términos de Servicio y nuestra Política de Privacidad. Si no estás de acuerdo, no uses el servicio.

Si usas Estudify en nombre de una institución educativa, declaras tener autoridad para aceptar estos términos en su nombre.`,
  },
  {
    title: "3. Uso aceptable",
    content: `Puedes usar Estudify.ai para:
• Crear material de estudio a partir de tus propios apuntes y recursos académicos.
• Practicar y medir tu dominio de temas educativos.
• Compartir material de estudio con compañeros de clase.

No puedes:
• Usar el servicio para generar contenido que presentes como propio en trabajos académicos entregables (trampa académica).
• Subir material protegido por derechos de autor sin autorización.
• Intentar acceder, modificar o interferir con cuentas de otros usuarios.
• Usar el servicio de forma que viole leyes aplicables.
• Hacer ingeniería inversa, descompilar o intentar extraer el código fuente del servicio.`,
  },
  {
    title: "4. Tu cuenta",
    content: `Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta. Notifícanos inmediatamente en hola@estudify.ai si detectas uso no autorizado.

Para registrarte debes proporcionar información veraz y actualizada. No puedes crear cuentas en nombre de otros sin su consentimiento.`,
  },
  {
    title: "5. Planes y pagos",
    content: `Estudify ofrece un plan gratuito (Free) y planes de pago (Pro, Team). Los planes de pago se cobran de forma recurrente (mensual o anual) mediante Stripe.

Puedes cancelar tu suscripción en cualquier momento desde tu cuenta. Al cancelar, mantendrás acceso a las funciones de pago hasta el final del período facturado. No realizamos reembolsos parciales salvo lo que exija la ley aplicable.

Nos reservamos el derecho de modificar precios con un aviso previo de 30 días. El uso continuado del servicio después de un cambio de precio constituye aceptación.`,
  },
  {
    title: "6. Propiedad intelectual",
    content: `El contenido que subes a Estudify.ai (tus apuntes, PDFs, texto) sigue siendo tuyo. Nos otorgas una licencia limitada para procesarlo con el único propósito de proveer el servicio.

El código, diseño, marca, nombre y tecnología de Estudify.ai son propiedad de Estudify.ai y están protegidos por leyes de propiedad intelectual. No puedes usar nuestros activos sin permiso escrito.`,
  },
  {
    title: "7. Limitación de responsabilidad",
    content: `Estudify.ai se proporciona "tal cual". No garantizamos que:
• El servicio sea ininterrumpido, libre de errores o perfectamente preciso en todo momento.
• Los resúmenes y exámenes generados estén 100% libres de imprecisiones (siempre verifica con tu material original).

En la máxima medida permitida por la ley, Estudify.ai no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del servicio.`,
  },
  {
    title: "8. Terminación",
    content: `Puedes eliminar tu cuenta en cualquier momento desde la configuración. Al eliminar tu cuenta, se eliminarán tus datos personales conforme a nuestra Política de Privacidad.

Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos, con o sin previo aviso dependiendo de la gravedad de la infracción.`,
  },
  {
    title: "9. Cambios a los términos",
    content: `Podemos actualizar estos términos periódicamente. Te notificaremos por correo con al menos 15 días de anticipación ante cambios materiales. El uso continuado del servicio constituye aceptación de los nuevos términos.`,
  },
  {
    title: "10. Contacto",
    content: `Para cualquier pregunta sobre estos términos:

Email: hola@estudify.ai
Estudify.ai — Ciudad de México, México`,
  },
];

export default function TermsPage() {
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
              Términos de Servicio
            </h1>
            <p className="text-[14px] text-[var(--text2)]">
              Última actualización: abril 2026
            </p>
          </div>

          <div className="space-y-10">
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
