'use client';

import { useState } from 'react';
import { Image as ImageIcon, PlayCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

interface ProjectCarouselProps {
  imagenes: string[] | null;
  videos: string[] | null;
}

export default function ProjectCarousel({ imagenes, videos }: ProjectCarouselProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const slides = [
    ...(videos || []).map(url => ({ type: 'video' as const, url })),
    ...(imagenes || []).map(url => ({ type: 'image' as const, url })),
  ];

  if (slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 border-[4px] border-white shadow-sm ring-1 ring-gray-200">
        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm font-medium">Sin contenido multimedia</p>
      </div>
    );
  }

  return (
    // Agregamos 'py-2' para darle un poco de aire vertical general
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none py-2">
      
      {/* 1. CARRUSEL PRINCIPAL CON MARCO BLANCO (Estilo 'Location') */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-xl bg-gray-900 border-[4px] border-white ring-1 ring-gray-200 group">
        <Swiper
          loop={true}
          spaceBetween={0}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          className="w-full aspect-video"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="bg-black">
              {slide.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      src={slide.url}
                      controls
                      className="w-full h-full object-contain" 
                      poster={imagenes?.[0] || undefined} 
                    />
                </div>
              ) : (
                <img
                  src={slide.url}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gradiente inferior para texto (opcional, igual que en Location) */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
      </div>

      {/* 2. MINIATURAS (Separadas con margen) */}
      {slides.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-slider h-24 px-1" // px-1 evita que el focus corte el borde
          breakpoints={{
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 7 },
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="cursor-pointer group rounded-xl overflow-hidden pt-1"> 
              <div className="w-full h-full border-2 border-transparent transition-all duration-300 opacity-50 hover:opacity-100 group-[.swiper-slide-thumb-active]:border-yellow-400 group-[.swiper-slide-thumb-active]:opacity-100 group-[.swiper-slide-thumb-active]:ring-2 group-[.swiper-slide-thumb-active]:ring-yellow-400/20 relative rounded-xl overflow-hidden shadow-sm">
                {slide.type === 'video' ? (
                   <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                      <video src={slide.url} className="w-full h-full object-cover opacity-60" />
                      <PlayCircle className="absolute w-8 h-8 text-white drop-shadow-lg" />
                   </div>
                ) : (
                   <img
                    src={slide.url}
                    alt={`Thumb ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* --- ESTILOS DE FLECHAS (Idénticos a tu componente Location) --- */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          width: 32px !important;
          height: 32px !important;
          border-radius: 50% !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(12px) !important;
          color: white !important;
          border: none !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 0;
          z-index: 20;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 14px !important;
          font-weight: bold !important;
        }

        .group:hover .swiper-button-next,
        .group:hover .swiper-button-prev {
          opacity: 1;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background-color: white !important;
          color: black !important;
          transform: scale(1.1);
        }

        .swiper-button-next { right: 16px !important; }
        .swiper-button-prev { left: 16px !important; }

        @media (max-width: 640px) {
            .swiper-button-next, .swiper-button-prev {
                opacity: 1 !important;
            }
        }
      `}</style>
    </div>
  );
}