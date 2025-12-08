'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Upload, ArrowLeft, Loader2, User } from 'lucide-react';
import Link from 'next/link';

export default function CrearPonentePage() {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Previsualización de la foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setValue('foto', e.target.files);
    }
  };

  const onSubmit = async (data: any) => {
    setUploading(true);
    try {
      let finalFotoUrl = null;

      // 1. Subir la foto (Si seleccionó una)
      const file = data.foto?.[0];
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `ponente-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('congreso') // Usamos el mismo bucket
          .upload(fileName, file);

        if (uploadError) throw new Error('Error subiendo imagen');

        const { data: publicUrlData } = supabase.storage
          .from('congreso')
          .getPublicUrl(fileName);
          
        finalFotoUrl = publicUrlData.publicUrl;
      }

      // 2. Guardar en la base de datos
      const { error: insertError } = await supabase
        .from('ponentes')
        .insert([
          {
            nombre: data.nombre,
            titulo: data.titulo,
            descripcion: data.descripcion,
            foto_url: finalFotoUrl
            
          }
        ]);

      if (insertError) throw insertError;

      // 3. Volver a la lista
      router.push('/admin/ponentes');
      router.refresh();

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Botón Volver */}
        <Link href="/admin/ponentes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" /> Volver a la lista
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar Nuevo Ponente</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Carga de Foto Circular */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition cursor-pointer group">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <User className="w-8 h-8 mb-1" />
                    <span className="text-xs">Subir Foto</span>
                  </div>
                )}
                
                {/* Input invisible sobre el círculo */}
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Click para subir imagen (Opcional)</p>
            </div>

            {/* Inputs de Texto */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Dr. Lucas Leys"
                />
                {errors.nombre && <span className="text-red-500 text-xs">Requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título / Cargo</label>
                <input
                  {...register("titulo", { required: "El título es obligatorio" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Conferencista Internacional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Info Extra</label>
                <input
                  {...register("descripcion")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Desde Argentina / Autor de 20 libros"
                />
              </div>
            </div>

            {/* Botón Guardar */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2 mt-4"
            >
              {uploading ? <Loader2 className="animate-spin" /> : "Guardar Ponente"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}