'use client'; 

import Countdown from 'react-countdown';
import { DatosGenerales } from '../types/database';

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return <span className="text-2xl font-bold text-yellow-400">¡El evento ha comenzado!</span>;
  }
  return (
    <div className="flex gap-4 md:gap-8 mt-10 justify-center">
      {[
        { val: days, label: 'Días' },
        { val: hours, label: 'Horas' },
        { val: minutes, label: 'Minutos' },
        { val: seconds, label: 'Segs' }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 w-20 md:w-24 border border-white/10 shadow-lg">
          <span className="text-2xl md:text-4xl font-bold text-white font-mono">{item.val}</span>
          <span className="text-[10px] md:text-xs text-gray-300 uppercase mt-1 tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Hero({ datos }: { datos: DatosGenerales }) {
  if (!datos) return null;

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Imagen de Fondo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center animate-ken-burns"
        style={{ backgroundImage: `url(${datos.fondo_portada})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Contenido Central */}
      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto mt-10 flex flex-col items-center">
        
        {/* 1. TÍTULO PRINCIPAL */}
        {/* CORRECCIÓN: Bajamos los tamaños (de 7xl a 6xl como máximo) y agregamos md:whitespace-nowrap para forzar la línea */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg md:whitespace-nowrap">
          {datos.nombre_evento}
        </h1>

        {/* 2. LÍNEA MEDIA - TEMA */}
        {datos.tema && (
            // También ajusté un poco el tamaño del tema para que combine mejor
            <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-4 tracking-widest uppercase drop-shadow-sm">
                {datos.tema}
            </h2>
        )}

        {/* 3. SLOGAN */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
          {datos.slogan}
        </p>

        {/* 4. CUENTA REGRESIVA */}
        <Countdown date={new Date(datos.fecha_evento)} renderer={renderer} />

        {/* 5. BOTÓN */}
        <div className="mt-12">
          <a
            href="/registro"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-yellow-500 hover:border-yellow-300 inline-block"
          >
            Asegura tu lugar
          </a>
        </div>
      </div>
    </div>
  );
}