'use client'; 

import Countdown from 'react-countdown';
import { DatosGenerales } from '../types/database';

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return <span className="text-xl md:text-2xl font-bold text-yellow-400 animate-pulse">¡El evento ha comenzado!</span>;
  }
  return (
    // CAMBIO: Espaciado progresivo (mt-6 en móvil, mt-8 en tablet/PC)
    <div className="flex gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8 justify-center">
      {[
        { val: days, label: 'Días' },
        { val: hours, label: 'Hrs' },
        { val: minutes, label: 'Min' },
        { val: seconds, label: 'Seg' }
      ].map((item, i) => (
        // CAMBIO: Tamaños intermedios para tablet (w-20)
        <div key={i} className="flex flex-col items-center bg-black/40 backdrop-blur-md rounded-xl p-2 md:p-4 w-16 sm:w-20 md:w-24 border border-white/10 shadow-lg">
          <span className="text-lg sm:text-2xl md:text-4xl font-bold text-white font-mono">{item.val}</span>
          <span className="text-[10px] md:text-xs text-gray-300 uppercase mt-1 tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Hero({ datos }: { datos: DatosGenerales }) {
  if (!datos) return null;

  return (
    // CAMBIO CLAVE: Padding progresivo (pt-32 -> md:pt-40 -> lg:pt-48)
    // Esto asegura que en laptops pequeñas el contenido no se vaya muy abajo.
    <div className="relative min-h-screen w-full flex items-start justify-center overflow-hidden pt-32 md:pt-40 lg:pt-48 pb-10">
      
      {/* 1. Fondo (Pantalla Completa siempre) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url(${datos.fondo_portada})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
      </div>

      {/* 2. Contenido */}
      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Título / Imagen */}
        {datos.titulo_imagen_url ? (
            // CAMBIO: Anchos máximos progresivos para que la imagen no sea gigante en tablets
            <div className="w-full max-w-[85%] sm:max-w-[80%] md:max-w-3xl lg:max-w-4xl animate-fade-in-up mb-4 md:mb-6">
                <img 
                    src={datos.titulo_imagen_url} 
                    alt={datos.nombre_evento} 
                    className="w-full h-auto object-contain drop-shadow-2xl mx-auto" 
                />
            </div>
        ) : (
            <div className="animate-fade-in-up mb-6 md:mb-8 mt-2 md:mt-6">
                {/* CAMBIO: Tamaños de fuente intermedios (sm:text-5xl) para tablets */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 md:mb-4 tracking-tight drop-shadow-lg leading-tight">
                    {datos.nombre_evento}
                </h1>

                {datos.tema && (
                    <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-yellow-400 mt-2 md:mt-4 tracking-widest uppercase drop-shadow-md bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-sm inline-block border border-yellow-400/20">
                        {datos.tema}
                    </h2>
                )}

                <p className="text-sm sm:text-base md:text-xl text-gray-300 mt-4 md:mt-6 max-w-2xl mx-auto font-light leading-relaxed px-4">
                    {datos.slogan}
                </p>
            </div>
        )}

        {/* Contador */}
        <div suppressHydrationWarning={true} className="mt-2 w-full">
          <Countdown date={new Date(datos.fecha_evento)} renderer={renderer} />
        </div>

        {/* Botón */}
        <div className="mt-8 md:mt-12">
          <a
            href="/registro"
            className="group relative bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 sm:py-4 sm:px-10 md:px-12 rounded-full text-base sm:text-lg transition transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)] inline-flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">¡Inscríbete Ahora!</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
}