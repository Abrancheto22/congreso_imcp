import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';

// Regenera la página máximo 1 vez por minuto.
export const revalidate = 60; // (Segundos)

export default async function TodosLosPonentesPage() {
  // Consulta SIN LÍMITE para traer a todos
  const { data: ponentes } = await supabase
    .from('ponentes')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar con fondo oscuro para que se vea */}
      <div className="bg-gray-900 relative h-24 shadow-md">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        
        {/* Botón Volver con mejor estilo */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition group font-medium"
          >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" /> 
              Volver al inicio
          </Link>
        </div>
        
        {/* Título Principal */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Nuestros Invitados
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Conoce a las voces inspiradoras que serán parte de este evento histórico.
          </p>
        </div>

        {/* --- CAMBIO PRINCIPAL: Flexbox Centrado y Tarjetas Mejoradas --- */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-10">
          {ponentes?.map((ponente) => (
            <div key={ponente.id} className="w-full sm:w-72 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center">
              
              {/* Foto con borde degradado sutil */}
              <div className="relative w-48 h-48 mb-6 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-white shadow-inner">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                  {ponente.foto_url ? (
                    <img 
                      src={ponente.foto_url} 
                      alt={ponente.nombre} 
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <User className="w-20 h-20" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Información */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{ponente.nombre}</h3>
              
              {/* Decoración visual (Línea que crece) */}
              <div className="h-1 w-12 bg-blue-500 rounded-full mb-3 opacity-50 group-hover:w-24 transition-all duration-300"></div>
              
              <p className="text-gray-500 font-medium text-lg">{ponente.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}