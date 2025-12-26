'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DatosDonaciones } from '@/types/database';
import { toast } from 'sonner';
import { 
  Save, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Loader2, 
  Trash2, 
  UploadCloud,
  Video // Importamos el icono de video
} from 'lucide-react';

import AdminNavbar from '@/components/admin/AdminNavbar';// Asegúrate que la ruta sea correcta

export default function AdminDonacionesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados de carga separados para imagen y video
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingVid, setUploadingVid] = useState(false);
  
  const [datos, setDatos] = useState<DatosDonaciones | null>(null);

  // 1. Carga inicial
  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('datos_donaciones').select('*').single();
        if (data) {
          setDatos(data);
        } else if (error && error.code === 'PGRST116') {
          setDatos({
            id: 0, 
            titulo: 'Únete a Nuestro Sueño',
            descripcion: 'Tu aporte nos ayuda a seguir avanzando.',
            imagenes: [],
            videos: []
          });
        }
      } catch (error) {
        toast.error("Error al cargar la configuración");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 2. Guardar en BD
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!datos) return;
    setSaving(true);

    try {
        const { error } = await supabase
            .from('datos_donaciones')
            .upsert({ 
                id: datos.id === 0 ? undefined : datos.id,
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                imagenes: datos.imagenes,
                videos: datos.videos
            })
            .select()
            .single();

      if (error) throw error;
      toast.success("Cambios guardados correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar en base de datos");
    } finally {
      setSaving(false);
    }
  };

  // 3. SUBIDA DE IMÁGENES
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploadingImg(true);
    const files = Array.from(event.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
          // Bucket 'imagenes'
          const fileName = `donaciones-img-${Date.now()}-${cleanName}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('imagenes').upload(fileName, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('imagenes').getPublicUrl(fileName);
          newUrls.push(data.publicUrl);
      }

      if (newUrls.length > 0) {
          setDatos(prev => prev ? ({ ...prev, imagenes: [...(prev.imagenes || []), ...newUrls] }) : null);
          toast.success(`${newUrls.length} imágenes subidas.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error subiendo imágenes.");
    } finally {
      setUploadingImg(false);
      event.target.value = '';
    }
  };

  // 4. SUBIDA DE VIDEOS (NUEVO)
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploadingVid(true);
    const files = Array.from(event.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
          // Validar tamaño (opcional, ej: 50MB)
          if (file.size > 50 * 1024 * 1024) {
             toast.warning(`El video ${file.name} es muy pesado (>50MB). Podría fallar.`);
          }

          const fileExt = file.name.split('.').pop();
          const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
          // Bucket 'videos' (Asegúrate de haber corrido el SQL)
          const fileName = `donaciones-vid-${Date.now()}-${cleanName}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('videos').getPublicUrl(fileName);
          newUrls.push(data.publicUrl);
      }

      if (newUrls.length > 0) {
          setDatos(prev => prev ? ({ ...prev, videos: [...(prev.videos || []), ...newUrls] }) : null);
          toast.success(`${newUrls.length} videos subidos.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error subiendo videos. Verifica tu bucket 'videos'.");
    } finally {
      setUploadingVid(false);
      event.target.value = '';
    }
  };

  // Eliminar items
  const removeMedia = (type: 'img' | 'vid', index: number) => {
    setDatos(prev => {
      if (!prev) return null;
      if (type === 'img') {
          const newArr = [...(prev.imagenes || [])];
          newArr.splice(index, 1);
          return { ...prev, imagenes: newArr };
      } else {
          const newArr = [...(prev.videos || [])];
          newArr.splice(index, 1);
          return { ...prev, videos: newArr };
      }
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {loading ? (
             <div className="flex h-full w-full items-center justify-center">
               <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
             </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
              
              {/* Encabezado */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestión del Proyecto</h1>
                  <p className="text-sm text-gray-500 mt-1">Configura el título, historia y multimedia del proyecto.</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </div>

              {/* 1. TEXTOS */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <LayoutTemplate className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-bold text-gray-800">Detalles del Proyecto</h2>
                </div>
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Proyecto</label>
                    <input
                      type="text"
                      value={datos?.titulo || ''}
                      onChange={e => setDatos(prev => prev ? { ...prev, titulo: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Ej: Construcción del Templo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Historia / Descripción</label>
                    <textarea
                      rows={4}
                      value={datos?.descripcion || ''}
                      onChange={e => setDatos(prev => prev ? { ...prev, descripcion: e.target.value } : null)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      placeholder="Cuenta por qué es importante este proyecto..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. GALERÍA DE IMÁGENES */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-800">Galería de Fotos</h2>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{datos?.imagenes?.length || 0} fotos</span>
                </div>

                <div className="space-y-4">
                  {/* Upload Imágenes */}
                  <div className="relative group">
                    <input 
                        type="file" accept="image/*" multiple 
                        onChange={handleImageUpload} disabled={uploadingImg}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${uploadingImg ? 'bg-blue-50 border-blue-300' : 'border-gray-300 group-hover:border-blue-400'}`}>
                        {uploadingImg ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin" /> : <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />}
                        <p className="text-sm font-medium text-gray-700 mt-2">{uploadingImg ? "Subiendo fotos..." : "Subir Fotos (Click o Arrastrar)"}</p>
                    </div>
                  </div>

                  {/* Grid Imágenes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {datos?.imagenes?.map((img, idx) => (
                        <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => removeMedia('img', idx)} className="absolute top-1 right-1 bg-white text-red-500 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* 3. GALERÍA DE VIDEOS (NUEVO) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-800">Galería de Videos</h2>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{datos?.videos?.length || 0} videos</span>
                </div>

                <div className="space-y-4">
                  {/* Upload Videos */}
                  <div className="relative group">
                    <input 
                        type="file" accept="video/*" multiple 
                        onChange={handleVideoUpload} disabled={uploadingVid}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${uploadingVid ? 'bg-purple-50 border-purple-300' : 'border-gray-300 group-hover:border-purple-400'}`}>
                        {uploadingVid ? <Loader2 className="w-8 h-8 text-purple-500 animate-spin" /> : <Video className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />}
                        <p className="text-sm font-medium text-gray-700 mt-2">{uploadingVid ? "Subiendo videos..." : "Subir Videos (MP4, WebM)"}</p>
                        <p className="text-xs text-gray-400">Máximo recomendado 50MB por video</p>
                    </div>
                  </div>

                  {/* Lista de Videos */}
                  {datos?.videos?.length === 0 && <p className="text-sm text-gray-400 text-center italic">No hay videos subidos.</p>}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {datos?.videos?.map((vid, idx) => (
                        <div key={idx} className="group relative bg-black rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          {/* Reproductor de video HTML5 */}
                          <video src={vid} controls className="w-full aspect-video object-cover" />
                          
                          {/* Botón Eliminar (sobre el video) */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => removeMedia('vid', idx)} className="bg-white/90 text-red-600 p-2 rounded-full shadow hover:bg-white">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}