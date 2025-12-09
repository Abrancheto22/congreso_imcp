import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Speakers from '@/components/Speakers';
import Location from '@/components/Location';
import PaymentMethods from '@/components/PaymentMethods';
import Footer from '@/components/Footer';

// Revalidación cada 60 segundos (ISR)
export const revalidate = 60;

export default async function Home() {
  // 1. Datos Generales
  const { data: datosGenerales } = await supabase
    .from('datos_generales')
    .select('*')
    .single();

  // 2. Ponentes (MODIFICADO: Sin límite)
  // Quitamos .limit(3) para traer a TODOS los ponentes para el carrusel
  const { data: ponentes } = await supabase
    .from('ponentes')
    .select('*')
    .order('created_at', { ascending: true });

  // 3. Pagos
  const { data: pagos } = await supabase
    .from('pagos')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {datosGenerales ? <Hero datos={datosGenerales} /> : null}

      {/* Pasamos los ponentes al componente (ya no necesitamos totalCount) */}
      {ponentes && ponentes.length > 0 && (
        <Speakers ponentes={ponentes} />
      )}

      {datosGenerales && <Location datos={datosGenerales} />}
      {pagos && pagos.length > 0 && <PaymentMethods pagos={pagos} />}
      <Footer />
    </main>
  );
}