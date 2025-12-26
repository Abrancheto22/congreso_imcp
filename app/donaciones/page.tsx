import Navbar from '@/components/Navbar';
import PaymentMethods from '@/components/PaymentMethods';
import Footer from '@/components/Footer';
import ProjectCarousel from '@/components/ProjectCarousel'; // Tu carrusel nuevo
import { supabase } from '@/lib/supabase';
import { ArrowDown, Heart, Info, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Pago, DatosGenerales, DatosDonaciones } from '@/types/database';
import WhatsAppButton from '@/components/WhatsAppButton';

export const dynamic = 'force-dynamic';

async function getPagos() {
  const { data } = await supabase.from('pagos').select('*').order('created_at', { ascending: true });
  return (data as Pago[]) || [];
}

async function getDatosGenerales() {
  const { data } = await supabase.from('datos_generales').select('logo_navbar_url, logo_footer_url').single();
  return data as DatosGenerales | null; 
}

async function getProyecto() {
  const { data } = await supabase.from('datos_donaciones').select('*').single();
  return data as DatosDonaciones | null;
}

export default async function DonacionesPage() {
  const pagos = await getPagos();
  const datosGenerales = await getDatosGenerales();
  const proyecto = await getProyecto();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-yellow-200">
      
      {/* NAVBAR */}
      <div className="bg-gray-900 w-full z-40 relative h-24 flex items-center shadow-md">
          <Navbar logoUrl={datosGenerales?.logo_navbar_url} />
      </div>

      {/* --- 1. ENCABEZADO DE IMPACTO --- */}
      <section className="relative pt-16 pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
            
            {/* Título Editorial */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6 tracking-tight text-balance">
                {proyecto?.titulo || 'Título del Proyecto'}
            </h1>

            {/* Subrayado Decorativo */}
            <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* --- 2. CARRUSEL CINEMÁTICO --- */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-16">
         <div className="shadow-2xl shadow-gray-200 rounded-3xl overflow-hidden border border-gray-100">
             <ProjectCarousel 
                imagenes={proyecto?.imagenes || []} 
                videos={proyecto?.videos || []} 
             />
         </div>
      </section>

      {/* --- 3. CONTENIDO: HISTORIA + SIDEBAR --- */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* COLUMNA IZQUIERDA: La Historia (8 columnas) */}
            <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-6 text-gray-400 font-medium text-sm uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Sobre la Causa</span>
                </div>

                {/* Descripción con Estilo "Prose" */}
                {/* 'whitespace-pre-line' respeta los párrafos que escribas en el admin */}
                <div className="prose prose-lg prose-slate max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                    <p className="first-letter:text-5xl first-letter:font-black first-letter:text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:mt-[-5px]">
                        {proyecto?.descripcion || 'Aquí aparecerá la descripción detallada del proyecto.'}
                    </p>
                </div>
            </div>

            {/* COLUMNA DERECHA: Sidebar Sticky (4 columnas) */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Tarjeta de Resumen / CTA Flotante */}
                <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl shadow-gray-100/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">¿Por qué donar?</h3>
                    
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start gap-3">
                            <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                                <Heart className="w-4 h-4 text-green-600 fill-green-600" />
                            </div>
                            <span className="text-gray-600 text-sm">Tu aporte impacta directamente en el avance de la obra.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-yellow-100 p-1.5 rounded-full mt-0.5">
                                <MapPin className="w-4 h-4 text-yellow-600" />
                            </div>
                            <span className="text-gray-600 text-sm">Ayuda a construir un lugar de bendición para la ciudad.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-purple-100 p-1.5 rounded-full mt-0.5">
                                <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-gray-600 text-sm">Sé parte de la historia que estamos escribiendo hoy.</span>
                        </li>
                    </ul>

                    {/* Botón que lleva a la sección de pagos */}
                    <a 
                        href="#seccion-pagos" 
                        className="group flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg"
                    >
                        <span>Ir a Métodos de Pago</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </a>
                    
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Tu donación es 100% segura y directa a la cuenta de la iglesia.
                    </p>
                </div>

            </div>

        </div>
      </section>

      {/* --- 4. SECCIÓN DE PAGOS --- */}
      <div id="seccion-pagos" className="bg-gray-50 py-20 border-t border-gray-200">
         <div className="max-w-4xl mx-auto px-4 text-center mb-12">
            <span className="text-yellow-600 font-bold tracking-widest text-xs uppercase mb-2 block">Tu momento de sembrar</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Elige cómo quieres donar</h2>
         </div>

         <div className="max-w-5xl mx-auto px-4">
             <PaymentMethods 
                pagos={pagos} 
                datosGenerales={{ ...datosGenerales, donacion_imagenes: [] } as any} 
             />
         </div>
      </div>

      <Footer logoUrl={datosGenerales?.logo_footer_url} />
      <WhatsAppButton 
        phone="51912434962"
        message="Hola, me gustaría saber más sobre cómo apoyar al proyecto del campamento." 
      />
    </main>
    
  );
}