import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import PaymentSidebar from '@/components/PaymentSidebar';
import Footer from '@/components/Footer'; // 1. Importamos el Footer
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getPagos() {
  const { data } = await supabase.from('pagos').select('*').order('created_at', { ascending: true });
  return data || [];
}

async function getDatosGenerales() {
  const { data } = await supabase.from('datos_generales').select('*').single();
  return data;
}

export default async function RegistroPage() {
  const pagos = await getPagos();
  const datos = await getDatosGenerales();

  return (
    // CAMBIO: 'flex flex-col' para organizar verticalmente y quitar padding bottom (pb) del main
    <main className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* HEADER OSCURO */}
      <div className="bg-gray-900 relative w-full min-h-[100px] shadow-md z-30 flex items-center justify-center flex-shrink-0">
        <div className="w-full h-full">
            <Navbar logoUrl={datos?.logo_navbar_url} />
        </div>
      </div>
      
      {/* CONTENIDO PRINCIPAL (flex-grow hace que ocupe todo el espacio disponible) */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Título */}
        <div className="mb-6 lg:mb-8 text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">Inscripción al Evento</h1>
            <p className="text-sm lg:text-base text-gray-500 mt-1">Completa tus datos para asegurar tu participación.</p>
        </div>

        {/* Grid de 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          <aside className="lg:col-span-5 lg:sticky lg:top-8 space-y-4 lg:space-y-6">
              <PaymentSidebar pagos={pagos} />
          </aside>

          <div className="lg:col-span-7">
              <RegistrationForm />
          </div>

        </div>
      </div>

      {/* FOOTER AL FINAL */}
      {/* Le pasamos el logo para que mantenga la identidad */}
      <Footer logoUrl={datos?.logo_footer_url} />

    </main>
  );
}