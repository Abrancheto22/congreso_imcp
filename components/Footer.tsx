import Link from 'next/link';
import { Facebook, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="bg-gray-950 text-white pt-12 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECCIÓN PRINCIPAL: 4 COLUMNAS EN LÍNEA (lg:grid-cols-4) */}
        {/* En móvil es 1 columna, en tablet 2, y en PC 4 en línea */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start mb-10">
          
          {/* 1. IDENTIDAD (Logo y Nombre) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                {logoUrl ? (
                    // CAMBIO: h-12 -> h-9 (Más pequeño)
                    <img src={logoUrl} alt="Logo" className="h-9 w-auto object-contain" />
                ) : (
                    // CAMBIO: text-3xl -> text-2xl
                    <span className="text-yellow-500 text-2xl font-bold">✝</span>
                )}
                <div className="flex flex-col">
                  {/* CAMBIO: text-base -> text-[10px] y uppercase para que se vea como etiqueta */}
                  <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wider leading-tight">
                    <br /><br />
                    Iglesia Misión de Cristo en el Perú
                  </span>
                  {/* CAMBIO: text-base -> text-sm */}
                  <p className="text-gray-200 text-sm font-bold leading-tight mt-0.5">
                    Principe de Paz
                  </p>
                </div>
            </div>
          </div>

          {/* 2. MISIÓN */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-2">
              Misión
              <div className="h-px flex-1 bg-gray-900"></div>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed text-pretty text-justify">
              Formar líderes competentes, comprometidos con la extensión del reino de Dios.
            </p>
          </div>

          {/* 3. VISIÓN */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-2">
              Visión
              <div className="h-px flex-1 bg-gray-900"></div> {/* Línea decorativa */}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed text-pretty text-justify">
              Ser una iglesia Cristocéntrica en crecimiento con infraestructura propia, sólidamente establecida en los fundamentos bíblicos y que cumpla su rol misionero en la sociedad.
            </p>
          </div>

          {/* 4. FACEBOOK / UBICACIÓN */}
          <div className="flex flex-col gap-2">
             <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-1">
              Síguenos
            </h3>
            <a 
                href="https://www.facebook.com/IMCPPrincipedePaz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gray-900 border border-gray-800 hover:border-blue-700/50 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 w-full"
            >
                <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    <Facebook className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0"> {/* min-w-0 ayuda a truncar textos largos */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Facebook</span>
                        <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition" />
                    </div>
                    <p className="text-xs text-gray-300 flex items-start gap-1.5 group-hover:text-white transition leading-tight">
                        <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" /> 
                        <span>Calle San Jose 198, El Porvenir</span>
                    </p>
                </div>
            </a>
          </div>

        </div>

        {/* LÍNEA SEPARADORA */}
        <hr className="border-gray-900 mb-6" />

        {/* BARRA INFERIOR (Mantenemos igual) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <ul className="flex flex-wrap justify-center gap-6">
            <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
            <li><Link href="/#invitados" className="hover:text-white transition">Ponentes</Link></li>
            <li><Link href="/#ubicacion" className="hover:text-white transition">Ubicación</Link></li>
            <li><Link href="/#pago" className="hover:text-white transition">Donaciones</Link></li>
            <li><Link href="/registro" className="text-yellow-500 hover:text-yellow-400 transition">Inscripción</Link></li>
          </ul>

          <p className="text-center md:text-right">
            &copy; {new Date().getFullYear()} Principe de Paz.
          </p>
        </div>

      </div>
    </footer>
  );
}