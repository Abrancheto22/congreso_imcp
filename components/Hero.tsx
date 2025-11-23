'use client'; // Necesario porque usa interactividad (cuenta regresiva)

import Countdown from 'react-countdown';
import { DatosGenerales } from '../types/database';

// Componente para renderizar los números de la cuenta regresiva
const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return <span className="text-2xl font-bold text-yellow-400">¡El evento ha comenzado!</span>;
  }
  // Renderizamos cajitas para cada unidad de tiempo
  return (
    <div className="flex gap-4 md:gap-8 mt-8 justify-center">
      {[
        { val: days, label: 'Días' },
        { val: hours, label: 'Horas' },
        { val: minutes, label: 'Minutos' },
        { val: seconds, label: 'Segundos' }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 w-20 md:w-24 border border-white/20">
          <span className="text-2xl md:text-4xl font-bold text-white">{item.val}</span>
          <span className="text-xs md:text-sm text-gray-200 uppercase mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function Hero({ datos }: { datos: DatosGenerales }) {
  if (!datos) return null;

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Imagen de Fondo con Overlay Oscuro */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${datos.fondo_portada})` }}
      >
        <div className="absolute inset-0 bg-black/60" /> {/* Oscurece la foto para leer el texto */}
      </div>

      {/* Contenido Central */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          {datos.nombre_evento}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          {datos.slogan}
        </p>

        {/* Cuenta Regresiva */}
        <Countdown date={new Date(datos.fecha_evento)} renderer={renderer} />

        {/* Botón Call to Action */}
        <div className="mt-12">
          <a
            href="/registro"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-xl"
          >
            Asegura tu lugar
          </a>
        </div>
      </div>
    </div>
  );
}