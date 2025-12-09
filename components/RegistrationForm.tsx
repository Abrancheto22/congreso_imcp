'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { Upload, CheckCircle, Loader2, X, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

const DEPARTAMENTOS = [
  "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca",
  "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad",
  "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco",
  "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
];

export default function RegistrationForm() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setPreviewUrls([]);
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newPreviews = Array.from(selectedFiles).map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviews);
      setValue('comprobante', selectedFiles);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const onSubmit = async (data: any) => {
    setUploading(true);
    setCompressing(true);
    try {
      const fileList = data.comprobante;
      if (!fileList || fileList.length === 0) throw new Error("Debes subir al menos un comprobante.");

      const uploadedUrls: string[] = [];
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg' };

      for (const originalFile of Array.from(fileList as FileList)) {
        let fileToUpload = originalFile;
        try {
            if (originalFile.type.startsWith('image/')) {
                fileToUpload = await imageCompression(originalFile, options);
            }
        } catch (error) { console.warn("Error comprimiendo", error); }

        const fileExt = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('congreso').upload(fileName, fileToUpload);
        if (uploadError) throw new Error(`Error al subir imagen`);

        const { data: publicUrlData } = supabase.storage.from('congreso').getPublicUrl(fileName);
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setCompressing(false);

      const { error: insertError } = await supabase
        .from('registros')
        .insert([
          {
            nombre_completo: data.nombre,
            departamento: data.departamento,
            iglesia: data.iglesia,
            genero: data.genero, // <--- CAMPO AGREGADO
            edad: parseInt(data.edad),
            numero: data.celular,
            voucher_url: uploadedUrls 
          }
        ]);

      if (insertError) throw new Error("Error al guardar datos");

      toast.success("¡Registro completado exitosamente!");
      setSuccess(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Error al registrar');
    } finally {
      setUploading(false);
      setCompressing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-20 animate-fade-in bg-white p-8 rounded-2xl shadow-xl transition-all duration-500 border border-green-100">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Registro Recibido!</h2>
        <p className="text-gray-600 mb-4">
          Hemos recibido tus datos y comprobantes.
        </p>
        <p className="text-sm text-gray-400">
          El formulario se reiniciará en unos segundos...
        </p>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-6 overflow-hidden">
          <div className="bg-green-500 h-1.5 rounded-full animate-[wiggle_5s_linear_forward]" style={{ width: '100%', transition: 'width 5s linear' }}></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Completa tu Inscripción</h2>
      <p className="text-gray-500 text-sm mb-6">Llene los datos con cuidado para validar su entrada.</p>
      
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
        <input
          {...register("nombre", { required: "Requerido" })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400"
          placeholder="Ej: Juan Pérez Almendra"
        />
        {errors.nombre && <span className="text-red-500 text-xs mt-1">Nombre requerido</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
          <input 
            {...register("celular", { required: "Requerido" })} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400" 
            placeholder="987 654 321"
          />
        </div>
        
        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
                {...register("departamento", { required: "Selecciona uno" })}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-700 appearance-none cursor-pointer"
            >
                <option value="">Seleccionar...</option>
                {DEPARTAMENTOS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                ))}
            </select>
          </div>
          {errors.departamento && <span className="text-red-500 text-xs mt-1">Selecciona tu región</span>}
        </div>
      </div>

      {/* FILA DE 3: Iglesia, Género, Edad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Iglesia</label>
          <input 
            {...register("iglesia")} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400" 
            placeholder="Ej: Comunidad de Fe"
          />
        </div>
        
        {/* NUEVO CAMPO GÉNERO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
          <select 
            {...register("genero", { required: "Requerido" })} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Seleccionar...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          {errors.genero && <span className="text-red-500 text-xs mt-1">Requerido</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input 
            type="number" 
            {...register("edad", { required: "Requerido", min: 10 })} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition placeholder:text-gray-400" 
            placeholder="Ej: 24"
          />
        </div>
      </div>

      {/* Sección Archivos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comprobante de Pago (Foto o Captura)
        </label>
        
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition relative group bg-gray-50/50 overflow-hidden">
          
          <div className="space-y-1 text-center pointer-events-none">
            <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition" />
            <div className="flex text-sm text-gray-600 justify-center mt-2">
              <span className="font-medium text-blue-600">Subir archivos</span>
            </div>
            <p className="text-xs text-gray-400">Puede seleccionar más de uno</p>
          </div>

          <input 
            type="file" 
            multiple 
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange} 
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2 animate-in fade-in">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
              </div>
            ))}
            <button 
              type="button"
              onClick={() => { setPreviewUrls([]); setValue('comprobante', null); }}
              className="flex flex-col items-center justify-center aspect-square rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition text-[10px] font-bold uppercase"
            >
              <X className="w-4 h-4 mb-1" />
              Borrar
            </button>
          </div>
        )}
        
        {errors.comprobante && <span className="text-red-500 text-xs mt-1 block">Debes subir al menos una foto</span>}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg hover:shadow-xl flex justify-center items-center gap-2 disabled:opacity-70 transform active:scale-95"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin" /> 
            {compressing ? "Comprimiendo..." : "Registrando..."}
          </>
        ) : (
          "Finalizar Registro"
        )}
      </button>
    </form>
  );
}