import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="py-14 px-6 md:px-8"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.png"
                alt="Estudify"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="font-bold text-[15px] text-white">
                estudify<span className="text-[var(--cyan)]">.ai</span>
              </span>
            </div>
            <p className="text-[13px] text-[var(--text2)] leading-relaxed max-w-[240px]">
              La IA que te entrena para dominar tu examen. Estudia menos,
              aprende más.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Producto
            </h4>
            <nav className="space-y-2.5" aria-label="Producto">
              <a
                href="/#features"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Funciones
              </a>
              <a
                href="/#how"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Cómo funciona
              </a>
              <Link
                href="/pricing"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Precios
              </Link>
              <a
                href="/#faq"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <nav className="space-y-2.5" aria-label="Legal">
              <Link
                href="/privacy"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Términos
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[12px] font-semibold text-white uppercase tracking-wider mb-4">
              Síguenos
            </h4>
            <nav className="space-y-2.5" aria-label="Redes sociales">
              <a
                href="https://www.instagram.com/estudify.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@estudify.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                TikTok
              </a>
              <a
                href="https://x.com/estudifyai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                X
              </a>
              <a
                href="https://youtube.com/@estudifyai"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-[var(--text2)] hover:text-white transition-colors"
              >
                YouTube
              </a>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <p className="text-[12px] text-[var(--text2)]">
            © 2026 Estudify.ai · Todos los derechos reservados.
          </p>
          <p className="text-[12px] text-[var(--text2)]">
            Hecho para estudiantes hispanohablantes.
          </p>
        </div>
      </div>
    </footer>
  );
}
