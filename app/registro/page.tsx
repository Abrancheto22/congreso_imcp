import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import PaymentSidebar from '@/components/PaymentSidebar';
import { supabase } from '@/lib/supabase';

// Forzamos que la página sea dinámica para que los pagos estén siempre frescos
export const dynamic = 'force-dynamic';

async function getPagos() {
  const { data } = await supabase.from('pagos').select('*').order('created_at', { ascending: true });
  return data || [];
}

export default async function RegistroPage() {
  const pagos = await getPagos();

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      
      {/* 1. Header Oscuro Compacto */}
      <div className="bg-gray-900 relative h-20 shadow-md z-20">
        <Navbar />
      </div>
      
      {/* Contenedor Principal (Más ancho y centrado) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Título de la Página */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Inscripción al Evento</h1>
            <p className="text-gray-500 mt-1">Completa tus datos para asegurar tu participación.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: Sidebar "Sticky" 
              (Se queda fija al hacer scroll) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
              <PaymentSidebar pagos={pagos} />
          </aside>

          {/* COLUMNA DERECHA: Formulario */}
          <div className="lg:col-span-7">
              <RegistrationForm />
          </div>

        </div>
      </div>
    </main>
  );
}