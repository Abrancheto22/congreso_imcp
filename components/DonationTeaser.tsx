'use client';

import Link from 'next/link';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { DatosGenerales } from '../types/database';

export default function DonationTeaser({ datosGenerales }: { datosGenerales: DatosGenerales | null }) {
  const bgImage = "https://i.imgur.com/H5xErAN.jpeg"; 

  return (
    <section id="donaciones" className="relative h-[550px] lg:h-[650px] w-full overflow-hidden group">
      
      {/* 1. IMAGEN DE FONDO (Con un pequeño zoom suave al pasar el mouse) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
            src={bgImage} 
            alt="Fondo Donación" 
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Degradado negro muy suave solo en la esquina inferior para que el texto se lea nítido */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
      </div>

      {/* 2. CONTENIDO ELEGANTE (Abajo Izquierda) */}
      <div className="absolute bottom-0 left-0 z-10 w-full p-8 lg:p-16">
        
        {/* Contenedor con línea lateral amarilla */}
        <div className="max-w-md animate-fade-in-up text-left pl-6 border-l-4 border-yellow-400 relative">
            
            {/* Pequeño destello decorativo arriba */}
            <Sparkles className="absolute -top-6 left-4 w-5 h-5 text-yellow-300 opacity-80" />

            {/* Título con impacto */}
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-none drop-shadow-lg">
                Únete al <span className="text-yellow-400">Sueño</span>
            </h2>
            
            {/* Subtítulo elegante */}
            <p className="text-base md:text-lg text-gray-200 mb-8 font-medium drop-shadow opacity-90 leading-relaxed">
                Sé parte de lo que Dios está haciendo. Tu siembra hace la diferencia.
            </p>

            {/* Botón Premium */}
            <div className="flex items-center gap-4">
                <Link 
                    href="/donaciones" 
                    className="group/btn inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm md:text-base py-3.5 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transform hover:-translate-y-0.5"
                >
                    <Heart className="w-5 h-5 fill-gray-900/20" />
                    <span>Donar Ahora</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>

        </div>
      </div>
    </section>
  );
}