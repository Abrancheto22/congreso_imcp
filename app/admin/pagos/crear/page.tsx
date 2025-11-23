'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Upload, ArrowLeft, Loader2, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function CrearPagoPage() {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Previsualización del QR (Opcional)
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

      // 1. Subir QR si existe
      const file = data.foto?.[0];
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `qr-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('congreso')
          .upload(fileName, file);

        if (uploadError) throw new Error('Error subiendo imagen');

        const { data: publicUrlData } = supabase.storage
          .from('congreso')
          .getPublicUrl(fileName);
          
        finalFotoUrl = publicUrlData.publicUrl;
      }

      // 2. Guardar en BD
      const { error: insertError } = await supabase
        .from('pagos')
        .insert([
          {
            nombre: data.nombre,
            destinatario: data.destinatario,
            numero: data.numero,
            foto_url: finalFotoUrl
          }
        ]);

      if (insertError) throw insertError;

      router.push('/admin/pagos');
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
        <Link href="/admin/pagos" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" /> Volver a la lista
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar Método de Pago</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Banco / App</label>
                    <input
                        {...register("nombre", { required: "Requerido" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: BCP, Yape, Interbank"
                    />
                    {errors.nombre && <span className="text-red-500 text-xs">Requerido</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titular de la Cuenta</label>
                    <input
                        {...register("destinatario", { required: "Requerido" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: Iglesia Comunidad de Fe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta / Celular</label>
                <input
                    {...register("numero", { required: "Requerido" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    placeholder="Ej: 191-12345678-0-99"
                />
            </div>

            {/* Subida de QR (Opcional) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código QR (Opcional)</label>
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer group">
                        {previewUrl ? (
                            <img src={previewUrl} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <QrCode className="w-8 h-8 mb-1" />
                                <span className="text-xs">Subir QR</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    </div>
                    <p className="text-xs text-gray-500 max-w-xs">
                        Sube una imagen del código QR si es Yape o Plin para que los usuarios puedan escanearlo directamente.
                    </p>
                </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2 mt-4"
            >
              {uploading ? <Loader2 className="animate-spin" /> : "Guardar Método"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}