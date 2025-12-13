'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Ponente } from '../types/database';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Speakers({ ponentes }: { ponentes: Ponente[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      dragFree: true,
      containScroll: 'trimSnaps' 
    }, 
    [
      Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const preventSelectionClass = "select-none";

  return (
    <section id="invitados" className="py-24 bg-gray-90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conoce a Nuestros Invitados
          </h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className={`relative group px-4 md:px-12 ${preventSelectionClass}`}>
          
          <button 
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 text-gray-700 p-3 rounded-full hover:text-blue-600 hover:scale-110 transition hidden md:flex"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            {/* Quitamos gap del contenedor padre */}
            <div className="flex items-stretch"> 
              
              {ponentes.map((ponente) => (
                <div 
                  key={ponente.id} 
                  // AQUÍ ESTÁ LA SOLUCIÓN: Agregamos 'mr-6 md:mr-8' para separar las tarjetas
                  className="flex-[0_0_auto] min-w-0 w-[280px] flex flex-col group/card py-4 h-auto mr-6 md:mr-8"
                >
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 w-full h-full flex flex-col cursor-grab active:cursor-grabbing">
                    
                    <div className="flex-grow flex flex-col items-center text-center">
                        <div className="relative w-40 h-40 mx-auto mb-6 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-white shadow-inner flex-shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative pointer-events-none">
                            {ponente.foto_url ? (
                            <img
                                src={ponente.foto_url}
                                alt={ponente.nombre}
                                className="w-full h-full object-cover transition duration-500 group-hover/card:scale-110"
                                draggable="false"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User className="w-16 h-16" />
                            </div>
                            )}
                        </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 h-[3.5rem] flex items-center justify-center">
                            {ponente.nombre}
                        </h3>
                        <div className="h-1 w-10 bg-blue-500 rounded-full mx-auto mb-3 opacity-50 group-hover/card:w-20 transition-all duration-300 flex-shrink-0"></div>
                    </div>
                    
                    <div className="text-center mt-auto">
                        <p className="text-gray-900 font-medium">{ponente.titulo}</p>
                        {ponente.descripcion && (
                        <p className="text-sm text-gray-500 mt-2 italic line-clamp-3">
                            {ponente.descripcion}
                        </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 text-gray-700 p-3 rounded-full hover:text-blue-600 hover:scale-110 transition hidden md:flex"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>

        <p className={`text-center text-xs text-gray-400 mt-4 md:hidden flex items-center justify-center gap-2 ${preventSelectionClass}`}>
            <ChevronLeft className="w-3 h-3" /> Desliza <ChevronRight className="w-3 h-3" />
        </p>

      </div>
    </section>
  );
}