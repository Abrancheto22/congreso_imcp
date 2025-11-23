'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, MapPin, Image as ImageIcon, Type, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, watch } = useForm();
  const previewValues = watch();

  useEffect(() => {
    const fetchDatos = async () => {
      const { data } = await supabase.from('datos_generales').select('*').single();
      if (data) {
        setRecordId(data.id);
        setValue('nombre_evento', data.nombre_evento);
        setValue('lugar', data.lugar);
        setValue('slogan', data.slogan);
        setValue('fondo_portada', data.fondo_portada);
        setValue('google_maps_link', data.google_maps_link);
        setValue('iframe_mapa', data.iframe_mapa);
        
        const date = new Date(data.fecha_evento);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        setValue('fecha_evento', date.toISOString().slice(0, 16));
      }
    };
    fetchDatos();
  }, [setValue]);

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      if (!recordId) throw new Error("No se encontró el ID del evento");

      const { error } = await supabase
        .from('datos_generales')
        .update({
          nombre_evento: formData.nombre_evento,
          lugar: formData.lugar,
          slogan: formData.slogan,
          fecha_evento: new Date(formData.fecha_evento).toISOString(),
          fondo_portada: formData.fondo_portada,
          google_maps_link: formData.google_maps_link,
          iframe_mapa: formData.iframe_mapa
        })
        .eq('id', recordId);

      if (error) throw error;
      toast.success('¡Configuración actualizada!');
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start">
      
      {/* --- FORMULARIO COMPACTO (Izquierda) --- */}
      <div className="w-full xl:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* 1. SECCIÓN INFORMACIÓN BÁSICA */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" /> Detalles del Evento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Nombre (Ocupa 8 columnas) */}
              <div className="md:col-span-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
                <input
                  {...register("nombre_evento", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                  placeholder="Ej: Conferencia 2025"
                />
              </div>

              {/* Fecha (Ocupa 4 columnas) */}
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                    type="datetime-local"
                    {...register("fecha_evento", { required: true })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
              </div>

              {/* Slogan (Full width) */}
              <div className="md:col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slogan / Subtítulo</label>
                <input
                  {...register("slogan")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Una frase inspiradora..."
                />
              </div>
            </div>
          </div>

          {/* 2. SECCIÓN APARIENCIA & UBICACIÓN */}
          <div className="p-6 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Ubicación y Multimedia
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Lugar Texto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lugar (Nombre)</label>
                    <input
                        {...register("lugar")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                </div>
                {/* Fondo URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Fondo (URL)</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            {...register("fondo_portada")}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono text-gray-600 truncate"
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Inputs de Mapa */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-500 font-medium">Link Google Maps (Botón)</label>
                    <input
                        {...register("google_maps_link")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs text-blue-600"
                        placeholder="https://maps.google.com/..."
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 font-medium">Iframe Embed (Mapa Visual)</label>
                    <textarea
                        {...register("iframe_mapa")}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[10px] font-mono text-gray-600 leading-tight"
                        placeholder='<iframe src="..."></iframe>'
                    />
                </div>
            </div>
          </div>

          {/* FOOTER BOTÓN */}
          <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end">
            <button
                type="submit"
                disabled={loading}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md flex items-center gap-2 text-sm"
            >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* --- PREVIEW STICKY (Derecha) --- */}
      <div className="w-full xl:w-1/3 xl:sticky xl:top-24 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Vista Previa</h3>
        
        {/* Card simulando el Hero */}
        <div className="relative w-full aspect-[4/5] md:aspect-video xl:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: previewValues.fondo_portada ? `url(${previewValues.fondo_portada})` : 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
                {previewValues.nombre_evento || "Evento"}
            </h1>
            <p className="text-gray-200 text-xs line-clamp-3 mb-4 opacity-90">
                {previewValues.slogan || "Slogan..."}
            </p>
            <div className="flex gap-1.5 opacity-90">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-10 bg-white/10 backdrop-blur-sm rounded flex flex-col items-center justify-center border border-white/20">
                        <span className="text-white font-bold text-xs">00</span>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-4 py-2 rounded-full shadow-lg">
                    Asegura tu lugar
                </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center px-4">
            Esta es una representación aproximada. Revisa la página principal para ver el resultado final.
        </p>
      </div>

    </div>
  );
}