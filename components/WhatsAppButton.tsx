'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string; // Ejemplo: "51999888777" (sin el +)
  message?: string;
}

export default function WhatsAppButton({ 
  phone, 
  message = "Hola, tengo una consulta sobre el proyecto del campamento." 
}: WhatsAppButtonProps) {
  
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      {/* Etiqueta de ayuda (Aparece en Hover) */}
      <span className="mr-3 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-2xl text-xs font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none border border-gray-100">
        ¿Tienes dudas? ¡Escríbenos!
      </span>

      {/* Botón Flotante */}
      <div className="relative">
        {/* Efecto de pulso animado de fondo */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        
        {/* Círculo Principal */}
        <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full shadow-2xl shadow-green-200 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-active:scale-95">
          <MessageCircle className="w-8 h-8 text-white fill-white/10" />
        </div>
      </div>
    </a>
  );
}