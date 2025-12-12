'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, MapPin, Image as ImageIcon, Type, Calendar, X, Upload, Image} from 'lucide-react';
import { toast } from 'sonner';

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  
  // Estado local para manejar la galería visualmente antes de guardar
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [donacionGalleryUrls, setDonacionGalleryUrls] = useState<string[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingDonacionGallery, setUploadingDonacionGallery] = useState(false);
  
  const { register, handleSubmit, setValue, watch } = useForm();
  const previewValues = watch();

  useEffect(() => {
    const fetchDatos = async () => {
      const { data } = await supabase.from('datos_generales').select('*').single();
      if (data) {
        setRecordId(data.id);
        setValue('nombre_evento', data.nombre_evento);
        setValue('tema', data.tema);
        setValue('lugar', data.lugar);
        setValue('slogan', data.slogan);
        setValue('fondo_portada', data.fondo_portada);
        setValue('google_maps_link', data.google_maps_link);
        setValue('titulo_imagen_url', data.titulo_imagen_url);
        setValue('iframe_mapa', data.iframe_mapa);
        setValue('logo_navbar_url', data.logo_navbar_url);
        setValue('logo_footer_url', data.logo_footer_url);
        
        // Cargar galería existente
        if (data.galeria_imagenes) setGalleryUrls(data.galeria_imagenes);
        if (data.donacion_imagenes) setDonacionGalleryUrls(data.donacion_imagenes);
        
        const date = new Date(data.fecha_evento);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        setValue('fecha_evento', date.toISOString().slice(0, 16));
      }
    };
    fetchDatos();
  }, [setValue]);

  // Función genérica para subir fotos (tanto a Galería Lugar como a Donaciones)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, isDonacion: boolean = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (isDonacion) {
      setUploadingDonacionGallery(true);
    } else {
      setUploadingGallery(true);
    }

    try {
        const newUrls: string[] = [];
        const folder = isDonacion ? 'donaciones' : 'galeria';
        const stateUpdater = isDonacion ? setDonacionGalleryUrls : setGalleryUrls;

        for (const file of Array.from(e.target.files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('congreso').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('congreso').getPublicUrl(fileName);
            newUrls.push(data.publicUrl);
        }
        
        stateUpdater(prev => [...prev, ...newUrls]);
        toast.success(`${newUrls.length} imágenes subidas a ${isDonacion ? 'Donaciones' : 'Galería'}`);
    } catch (error) {
        toast.error("Error subiendo imágenes");
    } finally {
        if (isDonacion) {
            setUploadingDonacionGallery(false);
        } else {
            setUploadingGallery(false);
        }
    }
  };

  // Función para quitar una foto de la lista (visual)
  const removeImage = (indexToRemove: number, isDonacion: boolean = false) => {
    const stateUpdater = isDonacion ? setDonacionGalleryUrls : setGalleryUrls;
    stateUpdater(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (formData: any) => {
    setLoading(true);
    try {
      if (!recordId) throw new Error("No se encontró el ID del evento");

      const { error } = await supabase
        .from('datos_generales')
        .update({
          nombre_evento: formData.nombre_evento,
          tema: formData.tema,
          lugar: formData.lugar,
          slogan: formData.slogan,
          fecha_evento: new Date(formData.fecha_evento).toISOString(),
          fondo_portada: formData.fondo_portada,
          google_maps_link: formData.google_maps_link,
          iframe_mapa: formData.iframe_mapa,
          galeria_imagenes: galleryUrls,
          donacion_imagenes: donacionGalleryUrls,
          titulo_imagen_url: formData.titulo_imagen_url,
          logo_navbar_url: formData.logo_navbar_url,
          logo_footer_url: formData.logo_footer_url
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
    <div className="flex flex-col xl:flex-row gap-8 items-start pb-20">
      
      {/* --- FORMULARIO PRINCIPAL --- */}
      <div className="w-full xl:w-2/3 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* GRUPO 1: DATOS GENERALES */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase">Información Principal</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nombre del Evento</label>
                <input {...register("nombre_evento")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tema (Subtítulo)</label>
                <input {...register("tema")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-blue-600 font-medium" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Fecha y Hora</label>
                <input type="datetime-local" {...register("fecha_evento")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Slogan / Descripción</label>
                <textarea {...register("slogan")} rows={2} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
          </div>

          {/* GRUPO 2: PORTADA Y TÍTULO (HERO) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase">Multimedia Portada</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Fondo (URL) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-3 uppercase">
                        URL Imagen de Fondo (Wallpaper)
                  </label>
                  {/* Input Visual para subir */}
                    <div className="flex items-center gap-4">
                        <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 w-full text-center hover:bg-gray-100 transition cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/png, image/webp" 
                                onChange={async (e) => {
                                    if (!e.target.files || e.target.files.length === 0) return;
                                    const file = e.target.files[0];
                                    const fileName = `portada-${Date.now()}.png`;
                                    const { data } = await supabase.storage.from('congreso').upload(fileName, file);
                                    if (data) {
                                        const { data: publicUrl } = supabase.storage.from('congreso').getPublicUrl(fileName);
                                        setValue('fondo_portada', publicUrl.publicUrl); // Guardamos la URL
                                        toast.success("Imagen de título subida");
                                    }
                                }} 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            />
                            <span className="text-sm text-gray-500 font-medium">Click para subir PNG</span>
                        </div>

                        {/* Previsualización pequeña */}
                        {watch('fondo_portada') && (
                            <div className="w-32 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden relative group">
                                <img src={watch('fondo_portada')} className="max-w-full max-h-full object-contain" alt="preview" />
                                <button 
                                    type="button"
                                    onClick={() => setValue('fondo_portada', null)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="md:col-span-2 border-gray-100 my-2" />

                {/* 2. Título como Imagen (PNG) */}
                <div className="md:col-span-2">
                  
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase">
                        Imagen del Título (PNG Transparente)
                    </label>
                    
                    {/* Input Visual para subir */}
                    <div className="flex items-center gap-4">
                        <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 w-full text-center hover:bg-gray-100 transition cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/png, image/webp" 
                                onChange={async (e) => {
                                    if (!e.target.files || e.target.files.length === 0) return;
                                    const file = e.target.files[0];
                                    const fileName = `titulo-${Date.now()}.png`;
                                    const { data } = await supabase.storage.from('congreso').upload(fileName, file);
                                    if (data) {
                                        const { data: publicUrl } = supabase.storage.from('congreso').getPublicUrl(fileName);
                                        setValue('titulo_imagen_url', publicUrl.publicUrl); // Guardamos la URL
                                        toast.success("Imagen de título subida");
                                    }
                                }} 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            />
                            <span className="text-sm text-gray-500 font-medium">Click para subir PNG</span>
                        </div>

                        {/* Previsualización pequeña */}
                        {watch('titulo_imagen_url') && (
                            <div className="w-32 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden relative group">
                                <img src={watch('titulo_imagen_url')} className="max-w-full max-h-full object-contain" alt="preview" />
                                <button 
                                    type="button"
                                    onClick={() => setValue('titulo_imagen_url', null)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
          </div>

          {/* GRUPO 3: UBICACIÓN Y GALERÍA */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase">Ubicación y Galería</h3>
            </div>
            <div className="p-6 space-y-6">
                
                {/* Datos Mapa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Lugar (Nombre)</label>
                        <input {...register("lugar")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Link Google Maps (Botón)</label>
                        <input {...register("google_maps_link")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-xs" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Iframe Embed (Mapa Visual)</label>
                        <input {...register("iframe_mapa")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-xs font-mono" placeholder="<iframe...>" />
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* GESTOR DE GALERÍA */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-3 uppercase">Galería de Fotos (Lugar)</label>
                    
                    {/* Botón Subir */}
                    <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition cursor-pointer mb-4">
                        <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            {uploadingGallery ? <Loader2 className="animate-spin text-blue-600" /> : <Upload className="text-gray-400" />}
                            <span className="text-sm font-medium text-gray-600">{uploadingGallery ? "Subiendo..." : "Click para agregar fotos"}</span>
                        </div>
                    </div>

                    {/* Grid de Miniaturas */}
                    {galleryUrls.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {galleryUrls.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={url} className="w-full h-full object-cover" alt="galeria" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
          </div>

          {/* --- NUEVO GRUPO: GALERÍA DE DONACIONES --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-orange-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase">Galería de Donaciones</h3>
            </div>
            <div className="p-6 space-y-6">
                
                {/* Botón Subir */}
                <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition cursor-pointer mb-4">
                    {/* Al llamar handleGalleryUpload con 'true', sabe que es para donaciones */}
                    <input type="file" multiple accept="image/*" onChange={(e) => handleGalleryUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                        {uploadingDonacionGallery ? <Loader2 className="animate-spin text-blue-600" /> : <Upload className="text-gray-400" />}
                        <span className="text-sm font-medium text-gray-600">{uploadingDonacionGallery ? "Subiendo..." : "Click para agregar fotos (Carrusel Pagos)"}</span>
                    </div>
                </div>

                {/* Grid de Miniaturas */}
                {donacionGalleryUrls.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {donacionGalleryUrls.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                <img src={url} className="w-full h-full object-cover" alt="donacion-galeria" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx, true)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>

          {/* GRUPO EXTRA: LOGOS */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Image className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-gray-700 uppercase">Logos del Sitio</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Logo Navbar */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Logo Menú Superior (Navbar)</label>
                    <div className="flex items-center gap-4">
                        <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 w-full text-center hover:bg-gray-100 transition cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={async (e) => {
                                    if (!e.target.files || e.target.files.length === 0) return;
                                    const file = e.target.files[0];
                                    const fileName = `logo-nav-${Date.now()}.png`;
                                    const { data } = await supabase.storage.from('congreso').upload(fileName, file);
                                    if (data) {
                                        const { data: publicUrl } = supabase.storage.from('congreso').getPublicUrl(fileName);
                                        setValue('logo_navbar_url', publicUrl.publicUrl);
                                        toast.success("Logo Navbar subido");
                                    }
                                }} 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            />
                            <span className="text-sm text-gray-500 font-medium">Subir Logo Navbar</span>
                        </div>
                        {watch('logo_navbar_url') && (
                            <img src={watch('logo_navbar_url')} className="h-12 w-auto object-contain bg-gray-800 rounded p-1" alt="preview" />
                        )}
                    </div>
                    <input type="hidden" {...register("logo_navbar_url")} />
                </div>

                {/* 2. Logo Footer */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Logo Pie de Página (Footer)</label>
                    <div className="flex items-center gap-4">
                        <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 w-full text-center hover:bg-gray-100 transition cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={async (e) => {
                                    if (!e.target.files || e.target.files.length === 0) return;
                                    const file = e.target.files[0];
                                    const fileName = `logo-footer-${Date.now()}.png`;
                                    const { data } = await supabase.storage.from('congreso').upload(fileName, file);
                                    if (data) {
                                        const { data: publicUrl } = supabase.storage.from('congreso').getPublicUrl(fileName);
                                        setValue('logo_footer_url', publicUrl.publicUrl);
                                        toast.success("Logo Footer subido");
                                    }
                                }} 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            />
                            <span className="text-sm text-gray-500 font-medium">Subir Logo Footer</span>
                        </div>
                        {watch('logo_footer_url') && (
                            <img src={watch('logo_footer_url')} className="h-12 w-auto object-contain bg-gray-800 rounded p-1" alt="preview" />
                        )}
                    </div>
                    <input type="hidden" {...register("logo_footer_url")} />
                </div>

            </div>
          </div>

          {/* BOTÓN FLOTANTE DE GUARDAR */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
                type="submit"
                disabled={loading || uploadingGallery}
                className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 transition transform hover:scale-105"
            >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                Guardar Cambios
            </button>
          </div>

        </form>
      </div>

      {/* --- PREVIEW STICKY (Derecha) --- */}
      <div className="hidden xl:block w-1/3 sticky top-24">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-4">Vista Previa Portada</h3>
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black group">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 transition-all duration-700"
            style={{ backgroundImage: previewValues.fondo_portada ? `url(${previewValues.fondo_portada})` : 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight">{previewValues.nombre_evento || "Nombre Evento"}</h1>
            {previewValues.tema && <h2 className="text-lg text-yellow-400 font-bold tracking-widest uppercase mb-4">{previewValues.tema}</h2>}
            <p className="text-gray-300 text-xs line-clamp-3">{previewValues.slogan}</p>
          </div>
        </div>
      </div>

    </div>
  );
}