'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation'; // useParams para leer el ID
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Save, ArrowLeft, Loader2, User, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditarPonentePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Obtenemos el ID de la URL (ej: /admin/ponentes/123-abc-456)
  const params = useParams(); 
  const router = useRouter();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // 1. Cargar datos del ponente al entrar
  useEffect(() => {
    const fetchPonente = async () => {
      if (!params.id) return;

      const { data, error } = await supabase
        .from('ponentes')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) {
        toast.error("Error al cargar ponente");
        router.push('/admin/ponentes');
        return;
      }

      if (data) {
        setValue('nombre', data.nombre);
        setValue('titulo', data.titulo);
        setPreviewUrl(data.foto_url); // Mostramos la foto actual
      }
      setLoading(false);
    };

    fetchPonente();
  }, [params.id, setValue, router]);

  // Previsualización de nueva foto (si la cambia)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue('foto', e.target.files);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      let finalFotoUrl = previewUrl; // Por defecto mantenemos la foto que ya tenía

      // 2. Si seleccionó una NUEVA foto, la subimos
      const file = data.foto?.[0];
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `ponente-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('congreso')
          .upload(fileName, file);

        if (uploadError) throw new Error('Error subiendo imagen');

        const { data: publicUrlData } = supabase.storage
          .from('congreso')
          .getPublicUrl(fileName);
          
        finalFotoUrl = publicUrlData.publicUrl;
      }

      // 3. Actualizamos en la Base de Datos
      const { error: updateError } = await supabase
        .from('ponentes')
        .update({
          nombre: data.nombre,
          titulo: data.titulo,
          foto_url: finalFotoUrl
        })
        .eq('id', params.id); // ¡Importante! Solo actualizamos este ID

      if (updateError) throw updateError;

      toast.success("Ponente actualizado correctamente");
      router.push('/admin/ponentes');
      router.refresh();

    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        
        <Link href="/admin/ponentes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 w-fit transition">
          <ArrowLeft className="w-4 h-4" /> Cancelar y volver
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Ponente</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Foto Circular (Igual que en crear) */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition cursor-pointer group">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <User className="w-8 h-8 mb-1" />
                    <span className="text-xs">Sin Foto</span>
                  </div>
                )}
                
                {/* Input invisible */}
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                
                {/* Overlay de "Cambiar" al pasar el mouse */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Upload className="text-white w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click en la imagen para cambiarla</p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  {...register("nombre", { required: "Requerido" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título / Cargo</label>
                <input
                  {...register("titulo", { required: "Requerido" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2 mt-4"
            >
              {saving ? <Loader2 className="animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}