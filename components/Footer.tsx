import Link from 'next/link';
import { Facebook, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="bg-gray-950 text-white pt-10 pb-6 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* SECCIÓN PRINCIPAL: Identidad vs Acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          
          {/* 1. LADO IZQUIERDO: Identidad + Texto pequeño */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-3">
                {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                    <span className="text-yellow-500 text-3xl font-bold">✝</span>
                )}
                <div className="flex flex-col">
                  <span className="text-gray-400 text-base font-normal">Iglesia Misión de Cristo en el Perú</span>
                  <p className="text-gray-300 text-base font-bold">Principe de Paz</p>

                </div>
                
            </div>
             
            {/* El texto que querías recuperar */}
            

            <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-500 mb-2">
                  Visión
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Ser una iglesia Cristocéntrica en crecimiento con infraestructura propia, solidamente establecida en los fundamentos bíblicos y que cumpla su rol misionero en la sociedad.
                </p>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-500 mb-2">
                  Misión
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Formar líderes competentes, comprometidos con la extensión del reino de Dios.
                </p>
              </div>
            </div>
          </div>

          {/* 2. LADO DERECHO: Tarjeta de Facebook/Ubicación */}
          <div className="flex justify-start md:justify-end">
            <a 
                href="https://www.facebook.com/IMCPPrincipedePaz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gray-900 border border-gray-800 hover:border-blue-700/50 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 max-w-sm w-full"
            >
                <div className="bg-blue-600 p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">Síguenos en Facebook</span>
                        <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400 transition" />
                    </div>
                    <p className="text-sm font-medium text-gray-200 flex items-center gap-1.5 group-hover:text-white transition">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" /> 
                        Calle San Jose 198, El Porvenir
                    </p>
                </div>
            </a>
          </div>

        </div>

        {/* LÍNEA SEPARADORA */}
        <hr className="border-gray-900/60 mb-6" />

        {/* BARRA INFERIOR: Links y Copyright */}
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