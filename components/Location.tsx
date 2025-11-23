import { MapPin } from 'lucide-react';
import { DatosGenerales } from '../types/database';

export default function Location({ datos }: { datos: DatosGenerales }) {
  
  const mapLink = datos.google_maps_link 
    ? datos.google_maps_link 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(datos.lugar)}`;

  return (
    <section id="ubicacion" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Únete a Nosotros
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          {datos.lugar}
        </p>

        {/* Contenedor del Mapa */}
        <div className="relative w-full h-80 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg group">
          
          {datos.iframe_mapa ? (
            // OPCIÓN A: SI TENEMOS EL IFRAME, MOSTRAMOS EL MAPA REAL
            <div 
              className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
              dangerouslySetInnerHTML={{ __html: datos.iframe_mapa }} 
            />
          ) : (
            // OPCIÓN B: SI NO, MOSTRAMOS LA IMAGEN ESTÁTICA (FALLBACK)
            <>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Mapa de ubicación"
                className="w-full h-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-blue-600 p-4 rounded-full shadow-2xl animate-bounce">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
            </>
          )}

          {/* Botón flotante siempre visible para abrir la app de GPS */}
          <a 
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap z-10"
          >
            <MapPin className="w-4 h-4 text-red-500" /> Abrir GPS
          </a>
        </div>
      </div>
    </section>
  );
}