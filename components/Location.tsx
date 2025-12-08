'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { DatosGenerales } from '../types/database';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

// --- 1. COMPONENTE DEL MAPA (Aislado y Memorizado) ---
// Usamos 'memo' para que este bloque NO se renderice de nuevo cuando cambia el carrusel de al lado
const LocationMap = memo(({ datos }: { datos: DatosGenerales }) => {
  const mapLink = datos.google_maps_link 
    ? datos.google_maps_link 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(datos.lugar)}`;

  return (
    <div className="relative w-full h-[400px] lg:h-full bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 group">
      
      {datos.iframe_mapa ? (
        // Opción A: Mapa Interactivo (Iframe)
        <div 
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 grayscale group-hover:grayscale-0 transition duration-1000 ease-in-out"
          dangerouslySetInnerHTML={{ __html: datos.iframe_mapa }} 
        />
      ) : (
        // Opción B: Imagen Estática (Fallback)
        <div className="relative w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
              alt="Mapa estático"
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-red-500 drop-shadow-lg animate-bounce" />
            </div>
        </div>
      )}
      
      {/* Botón Flotante para ir al GPS */}
      <a 
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-900 px-5 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-sm border border-white/50 z-10"
      >
        <MapPin className="w-4 h-4 text-red-600" /> 
        Abrir GPS
      </a>
    </div>
  );
});

// Necesario para que React DevTools muestre el nombre correcto
LocationMap.displayName = 'LocationMap';


// --- 2. COMPONENTE DE GALERÍA DE FOTOS ---
const LocationGallery = ({ imagenesDB }: { imagenesDB: string[] | null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Configuración del Carrusel: Loop, Autoplay y efecto Fade (Desvanecer)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
    Fade()
  ]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Sincronizar el contador (1/5)
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) }; 
  }, [emblaApi]);

  // Imágenes por defecto si no hay nada en la base de datos
  const defaultImages = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505236858274-0959ac156d0f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800"
  ];

  // Decidir qué imágenes mostrar
  const imagesToShow = (imagenesDB && imagenesDB.length > 0) ? imagenesDB : defaultImages;

  return (
    <div className="relative w-full h-[400px] lg:h-full rounded-[2rem] overflow-hidden shadow-2xl group border-[6px] border-white ring-1 ring-gray-200">
      
      {/* Viewport del Carrusel */}
      <div className="overflow-hidden h-full w-full bg-gray-900" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {imagesToShow.map((img, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img 
                src={img} 
                alt={`Instalación ${idx + 1}`} 
                className="w-full h-full object-cover transform transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110" 
              />
              {/* Degradado para que el texto blanco se lea bien */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />
            </div>
          ))}
        </div>
      </div>

      {/* Info Flotante Inferior */}
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
        <div className="text-white">
            <div className="flex items-center gap-2 mb-1">
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Galería</span>
            </div>
            <h3 className="text-xl font-bold leading-tight">Nuestras Instalaciones</h3>
            <p className="text-sm text-gray-300 line-clamp-1">Un espacio preparado para recibirte.</p>
        </div>

        {/* Contador */}
        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-white">
            {selectedIndex + 1} <span className="text-gray-400">/</span> {imagesToShow.length}
        </div>
      </div>

      {/* Flechas de Navegación (Visibles al Hover) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
            onClick={scrollPrev}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
            onClick={scrollNext}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-110"
        >
            <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};


// --- 3. COMPONENTE PRINCIPAL (Layout) ---
export default function Location({ datos }: { datos: DatosGenerales }) {
  return (
    <section id="ubicacion" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Cabecera Principal */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight uppercase">
            Lugar del Evento
          </h2>
          
          {/* Etiqueta Grande de Ubicación */}
          <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white rounded-full shadow-md border border-gray-200 text-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
            <MapPin className="w-6 h-6 text-red-500 fill-red-50" />
            <span className="font-bold text-xl tracking-tight">{datos.lugar}</span>
          </div>
        </div>

        {/* Grid Principal: Mapa + Galería */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 h-auto lg:h-[500px]">
          
          {/* Componente Mapa */}
          <LocationMap datos={datos} />
          
          {/* Componente Galería (Pasando las fotos de la DB) */}
          <LocationGallery imagenesDB={datos.galeria_imagenes} />
          
        </div>

      </div>
    </section>
  );
}