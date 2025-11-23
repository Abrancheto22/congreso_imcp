import Link from 'next/link';
import { Ponente } from '../types/database';
import { User, ArrowRight } from 'lucide-react';

export default function Speakers({ ponentes, totalCount }: { ponentes: Ponente[], totalCount: number }) {
  return (
    <section id="invitados" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conoce a Nuestros Invitados
          </h2>
          <div className="h-1 w-20 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* --- CORRECCIÓN AQUÍ --- */}
        {/* Cambiamos 'grid' por 'flex flex-wrap justify-center'. 
            Esto hace que las tarjetas se agrupen en el centro siempre. */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {ponentes.map((ponente) => (
            // Añadimos 'w-full sm:w-64' para darles un ancho fijo base y que no se estiren raro
            <div key={ponente.id} className="w-full sm:w-64 flex flex-col items-center text-center group">
              
              {/* Foto con efecto Hover mejorado */}
              <div className="relative w-44 h-44 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition duration-300 ease-in-out bg-gray-100 cursor-pointer">
                {ponente.foto_url ? (
                  <img
                    src={ponente.foto_url}
                    alt={ponente.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="w-20 h-20" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{ponente.nombre}</h3>
              <p className="text-blue-600 font-medium">{ponente.titulo}</p>
            </div>
          ))}
        </div>

        {/* Botón Ver Todos */}
        {totalCount > ponentes.length && (
          <div className="mt-16 text-center animate-fade-in-up">
            <Link 
              href="/ponentes" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Ver todos los ponentes <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}