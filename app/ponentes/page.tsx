import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';

// Hacemos que la página sea dinámica
export const dynamic = 'force-dynamic';

export default async function TodosLosPonentesPage() {
  // Consulta SIN LÍMITE para traer a todos
  const { data: ponentes } = await supabase
    .from('ponentes')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar con fondo oscuro para que se vea */}
      <div className="bg-gray-900 relative h-24">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-12">
        
        {/* Botón Volver */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todos Nuestros Invitados Especiales
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conoce a cada uno de los siervos que estarán compartiendo palabra y adoración en este gran evento.
          </p>
        </div>

        {/* Grid Completo (Reutilizamos el estilo visual) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {ponentes?.map((ponente) => (
            <div key={ponente.id} className="flex flex-col items-center text-center group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow group-hover:scale-105 transition duration-300 bg-gray-100">
                {ponente.foto_url ? (
                  <img src={ponente.foto_url} alt={ponente.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400"><User className="w-12 h-12" /></div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{ponente.nombre}</h3>
              <p className="text-blue-600 text-sm font-medium">{ponente.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}