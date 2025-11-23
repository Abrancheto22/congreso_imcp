import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-20 px-6 py-6 flex justify-between items-center text-white">
      
      {/* 1. Logo que manda al inicio */}
      <Link 
        href="/" 
        className="flex items-center gap-2 font-bold text-xl hover:text-gray-200 transition"
      >
        <span>✝</span> 
        <span>Fe y Comunidad</span>
      </Link>

      {/* Enlaces del Menú */}
      {/* Nota: Usamos '/#id' para que funcionen incluso si estás en otra página */}
      <div className="hidden md:flex gap-8 text-sm font-medium">
        <Link href="/#invitados" className="hover:text-yellow-400 transition">Ponentes</Link>
        <Link href="/#ubicacion" className="hover:text-yellow-400 transition">Ubicación</Link>
        <Link href="/#pago" className="hover:text-yellow-400 transition">Pago</Link>
      </div>

      {/* 2. Botón que manda al formulario de registro */}
      <Link
        href="/registro"
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition shadow-lg transform hover:scale-105"
      >
        Regístrate Ahora
      </Link>
    </nav>
  );
}