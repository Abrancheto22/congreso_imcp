import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          
          {/* 1. IDENTIDAD (Izquierda) */}
          <div className="max-w-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <span>✝</span> Iglesia Principe de Paz
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Un ministerio comprometido con llevar el mensaje de esperanza y renovación a esta generación.
            </p>
          </div>

          {/* 2. CONTACTO RÁPIDO (Derecha) */}
          <div className="flex flex-col sm:flex-row gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
                <div className="bg-gray-900 p-2 rounded-lg"><MapPin className="w-4 h-4 text-blue-500" /></div>
                <span>Av. Principal 123, Trujillo</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-gray-900 p-2 rounded-lg"><Phone className="w-4 h-4 text-green-500" /></div>
                <span>+51 987 654 321</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-gray-900 p-2 rounded-lg"><Mail className="w-4 h-4 text-yellow-500" /></div>
                <span>contacto@iglesia.com</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-900 mb-6" />

        {/* 3. NAVEGACIÓN Y REDES (Inferior) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          
          {/* Links Horizontales */}
          <ul className="flex flex-wrap justify-center gap-6 font-medium">
            <li><Link href="/" className="hover:text-white transition">Inicio</Link></li>
            <li><Link href="/#invitados" className="hover:text-white transition">Ponentes</Link></li>
            <li><Link href="/#ubicacion" className="hover:text-white transition">Ubicación</Link></li>
            <li><Link href="/#pago" className="hover:text-white transition">Donaciones</Link></li>
          </ul>

          {/* Redes Sociales Compactas */}
          <div className="flex gap-3">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition"><Youtube className="w-5 h-5" /></a>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-right">
            &copy; {new Date().getFullYear()} Principe de Paz. 
            <span className="hidden sm:inline"> Hecho con <Heart className="w-3 h-3 text-red-600 inline mx-0.5" />.</span>
          </p>
        </div>

      </div>
    </footer>
  );
}