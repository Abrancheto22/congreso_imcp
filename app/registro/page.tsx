import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import PaymentSidebar from '@/components/PaymentSidebar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Users } from 'lucide-react';

// Forzamos que la página sea dinámica para que el contador no se cachee
export const dynamic = 'force-dynamic';

async function getPagos() {
  const { data } = await supabase.from('pagos').select('*').order('created_at', { ascending: true });
  return data || [];
}

async function getDatosGenerales() {
  const { data } = await supabase.from('datos_generales').select('*').single();
  return data;
}

// CAMBIO: Ahora usamos la función RPC segura
async function getRegistradosCount() {
  // Llamamos a la función que creamos en SQL
  const { data, error } = await supabase.rpc('obtener_conteo_registros');
  
  if (error) {
    console.error("Error al obtener conteo:", error);
    return 0;
  }
  return data || 0;
}

export default async function RegistroPage() {
  const pagos = await getPagos();
  const datos = await getDatosGenerales();
  const totalRegistrados = await getRegistradosCount();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* HEADER OSCURO */}
      <div className="bg-gray-900 relative w-full min-h-[100px] shadow-md z-30 flex items-center justify-center flex-shrink-0">
        <div className="w-full h-full">
            <Navbar logoUrl={datos?.logo_navbar_url} />
        </div>
      </div>
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* CABECERA DE LA PÁGINA (Título + Contador) */}
        <div className="mb-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 text-center md:text-left">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Inscripción al Evento</h1>
                <p className="text-sm lg:text-base text-gray-500 mt-1">Completa tus datos para asegurar tu participación.</p>
            </div>

            {/* --- CONTADOR DE REGISTRADOS --- */}
            <div className="bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-full w-8 h-8">
                    <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Ya somos</span>
                    <div className="flex items-center gap-2">
                        {/* Mostramos el número obtenido de la función segura */}
                        <span className="text-xl font-black text-gray-900">{totalRegistrados}</span>
                        <span className="text-sm font-medium text-gray-600">inscritos</span>
                        
                        {/* Puntito verde parpadeante (Live) */}
                        <span className="flex h-2.5 w-2.5 relative ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                    </div>
                </div>
            </div>
            {/* --- FIN CONTADOR --- */}

        </div>

        {/* Grid de 2 Columnas (Sidebar + Formulario) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          <aside className="lg:col-span-5 lg:sticky lg:top-8 space-y-4 lg:space-y-6">
              <PaymentSidebar pagos={pagos} />
          </aside>

          <div className="lg:col-span-7">
              <RegistrationForm />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <Footer logoUrl={datos?.logo_footer_url} />

    </main>
  );
}