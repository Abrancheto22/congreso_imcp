// abrancheto22/congreso_imcp/Abrancheto22-congreso_imcp-0e99fb4e820aa5c0700d414c5dda17c5067b098d/app/page.tsx

import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Speakers from '@/components/Speakers';
import Location from '@/components/Location';
import PaymentMethods from '@/components/PaymentMethods';
import Footer from '@/components/Footer';
import DonationTeaser from '@/components/DonationTeaser';
import WhatsAppButton from '@/components/WhatsAppButton';

// Revalidación cada 60 segundos (ISR)
export const revalidate = 60;

// Función para obtener todos los datos
async function getDatosGenerales() {
  const { data } = await supabase
    .from('datos_generales')
    .select('*')
    .single();
  return data;
}

// Función principal
export default async function Home() {
  const datosGenerales = await getDatosGenerales();
  
  // 2. Ponentes
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
      <Navbar logoUrl={datosGenerales?.logo_navbar_url} />

      {datosGenerales ? <Hero datos={datosGenerales} /> : null}

      {ponentes && ponentes.length > 0 && (
        <Speakers ponentes={ponentes} />
      )}

      {datosGenerales && <Location datos={datosGenerales} />}
      <DonationTeaser datosGenerales={datosGenerales} />
            
      <Footer logoUrl={datosGenerales?.logo_footer_url} />
      <WhatsAppButton 
              phone="51912434962"
              message="Hola, me gustaría saber más sobre el congreso." 
            />
    </main>
  );
}