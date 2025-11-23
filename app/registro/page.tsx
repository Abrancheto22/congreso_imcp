import Navbar from '@/components/Navbar';
import RegistrationForm from '@/components/RegistrationForm';
import PaymentSidebar from '@/components/PaymentSidebar'; // <--- Importamos el nuevo componente
import { supabase } from '@/lib/supabase';

// Traemos los datos desde el servidor
async function getPagos() {
  const { data } = await supabase.from('pagos').select('*');
  return data || [];
}

export default async function RegistroPage() {
  const pagos = await getPagos();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar Oscuro */}
      <div className="bg-gray-900 relative h-24">
        <Navbar />
      </div>
      
      <div className="pt-12 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: Instrucciones y Pagos Mejorados */}
        {/* Le damos 5 columnas de ancho en pantallas grandes */}
        <div className="lg:col-span-5">
            <PaymentSidebar pagos={pagos} />
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        {/* Le damos 7 columnas de ancho para que tenga más espacio */}
        <div className="lg:col-span-7">
            <RegistrationForm />
        </div>

      </div>
    </main>
  );
}