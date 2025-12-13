'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { DatosGenerales } from '../types/database';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

// --- 1. COMPONENTE DEL MAPA ---
const LocationMap = memo(({ datos }: { datos: DatosGenerales }) => {
  const mapLink = datos.google_maps_link 
    ? datos.google_maps_link 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(datos.lugar)}`;

  return (
    <div className="relative w-full h-[300px] lg:h-full bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm border border-gray-200 group">
      
      {datos.iframe_mapa ? (
        <div 
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 group-hover:grayscale-0 transition duration-1000 ease-in-out"
          dangerouslySetInnerHTML={{ __html: datos.iframe_mapa }} 
        />
      ) : (
        <div className="relative w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
              alt="Mapa estático"
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg animate-bounce" />
            </div>
        </div>
      )}
      
      <a 
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-xs border border-white/50 z-10"
      >
        <MapPin className="w-3 h-3 text-red-600" /> 
        Abrir GPS
      </a>
    </div>
  );
});

LocationMap.displayName = 'LocationMap';


// --- 2. COMPONENTE DE GALERÍA ---
const LocationGallery = ({ imagenesDB }: { imagenesDB: string[] | null }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
    Fade()
  ]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) }; 
  }, [emblaApi]);

  const defaultImages = [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1505236858274-0959ac156d0f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800"
  ];

  const imagesToShow = (imagenesDB && imagenesDB.length > 0) ? imagenesDB : defaultImages;

  return (
    // CAMBIO: h-[300px] en móvil y lg:h-full
    <div className="relative w-full h-[300px] lg:h-full rounded-[2rem] overflow-hidden shadow-xl group border-[4px] border-white ring-1 ring-gray-200">
      
      <div className="overflow-hidden h-full w-full bg-gray-900" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {imagesToShow.map((img, idx) => (
            <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img 
                src={img} 
                alt={`Instalación ${idx + 1}`} 
                className="w-full h-full object-cover transform transition-transform duration-[10000ms] ease-linear scale-100 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />
            </div>
          ))}
        </div>
      </div>

      {/* Info Flotante - Ajustada para ser más compacta */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
        <div className="text-white">
            <h3 className="text-lg font-bold leading-tight mb-0.5">Nuestras Instalaciones</h3>
            <p className="text-xs text-gray-300 line-clamp-1">Espacio preparado para ti.</p>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-mono text-white">
            {selectedIndex + 1} <span className="text-gray-400">/</span> {imagesToShow.length}
        </div>
      </div>

      {/* Flechas */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={scrollPrev} className="pointer-events-auto w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={scrollNext} className="pointer-events-auto w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
            <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};


// --- 3. COMPONENTE PRINCIPAL (Layout Compacto) ---
export default function Location({ datos }: { datos: DatosGenerales }) {
  return (
    // CAMBIO: py-16 en lugar de py-24 (menos altura general)
    <section id="ubicacion" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Cabecera Compacta */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Lugar del Evento
          </h2>
          
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200 text-gray-800 hover:shadow-lg transition-all duration-300 cursor-default">
            <MapPin className="w-5 h-5 text-red-500 fill-red-50" />
            <span className="font-bold text-lg tracking-tight">{datos.lugar}</span>
          </div>
        </div>

        {/* CAMBIO: Altura máxima reducida a 400px en Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-auto lg:h-[400px]">
          
          <LocationMap datos={datos} />
          
          <LocationGallery imagenesDB={datos.galeria_imagenes} />
          
        </div>

      </div>
    </section>
  );
}