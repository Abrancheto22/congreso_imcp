import Link from 'next/link';

export default function Navbar() {
  // Definimos el estilo de la línea animada para no repetirlo
  const underlineClass = "absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full";

  return (
    <nav className="absolute top-0 left-0 w-full z-20 px-8 py-8 flex justify-between items-center text-white">
      
      {/* 1. Logo (Más grande y llamativo) */}
      <Link 
        href="/" 
        className="flex items-center gap-3 font-bold text-1xl hover:text-gray-200 transition"
      >
        <span className="text-3xl">✝</span> 
        <span>Iglesia Principe de Paz</span>
      </Link>

      {/* 2. Enlaces (A la derecha, más grandes y con animación) */}
      {/* justify-between en el padre empuja este div a la derecha automáticamente */}
      <div className="hidden md:flex gap-10 text-sl font-medium">
        
        <Link href="/#invitados" className="relative group">
          Ponentes
          <span className={underlineClass}></span>
        </Link>

        <Link href="/#ubicacion" className="relative group">
          Ubicación
          <span className={underlineClass}></span>
        </Link>

        <Link href="/#pago" className="relative group">
          Donaciones
          <span className={underlineClass}></span>
        </Link>

      </div>
    </nav>
  );
}