import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Speakers from '@/components/Speakers';
import Location from '@/components/Location';
import PaymentMethods from '@/components/PaymentMethods';

// Hacemos que la página se regenere en cada petición para ver cambios al instante
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Datos Generales
  const { data: datosGenerales } = await supabase
    .from('datos_generales')
    .select('*')
    .single();

  // 2. Ponentes (MODIFICADO)
  // Pedimos solo 3, pero usamos count: 'exact' para saber el total real
  const { data: ponentes, count: totalPonentes } = await supabase
    .from('ponentes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: true }) // Ordenados por antigüedad
    .limit(3); // <-- LÍMITE: Solo trae los 3 primeros para la portada

  // 3. Pagos
  const { data: pagos } = await supabase
    .from('pagos')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {datosGenerales ? <Hero datos={datosGenerales} /> : null}

      {/* Pasamos los ponentes y el TOTAL real al componente */}
      {ponentes && ponentes.length > 0 && (
        <Speakers ponentes={ponentes} totalCount={totalPonentes || 0} />
      )}

      {datosGenerales && <Location datos={datosGenerales} />}
      {pagos && pagos.length > 0 && <PaymentMethods pagos={pagos} />}
    </main>
  );
}