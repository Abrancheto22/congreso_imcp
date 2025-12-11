import Link from 'next/link';

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const underlineClass = "absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full";

  return (
    <nav className="absolute top-0 left-0 w-full z-20 px-4 py-4 md:px-8 md:py-8 flex justify-between items-center text-white">
      
      <Link 
        href="/" 
        className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl hover:text-gray-200 transition"
      >
        {/* --- AQUÍ ESTÁ EL ARREGLO --- */}
        {/* Usamos una condición estricta: ¿Hay URL válida? */}
        
        {logoUrl ? (
            // CASO A: SI hay logo, muestra SOLO la imagen
            <img 
                src={logoUrl} 
                alt="Logo Evento" 
                className="h-6 md:h-7 w-auto object-contain" 
            />
        ) : (
            // CASO B: NO hay logo, muestra SOLO el texto
            <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl">✝</span> 
                <span className="leading-tight">Iglesia Principe de Paz</span>
            </div>
        )}
        {/* ----------------------------- */}
      </Link>

      <div className="hidden md:flex gap-10 text-lg font-medium">
        <Link href="/#invitados" className="relative group">
          Ponentes <span className={underlineClass}></span>
        </Link>
        <Link href="/#ubicacion" className="relative group">
          Ubicación <span className={underlineClass}></span>
        </Link>
        <Link href="/#pago" className="relative group">
          Donaciones <span className={underlineClass}></span>
        </Link>
      </div>
    </nav>
  );
}