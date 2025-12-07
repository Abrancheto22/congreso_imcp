'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Plus, Trash2, User, AlertTriangle, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner'; // <--- Importamos Sonner

export default function AdminPonentesPage() {
  const [ponentes, setPonentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Eliminación
  const [deleteId, setDeleteId] = useState<string | null>(null); // Guarda el ID a borrar
  const [isDeleting, setIsDeleting] = useState(false); // Para mostrar carga en el botón rojo

  const fetchPonentes = async () => {
    const { data } = await supabase
      .from('ponentes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setPonentes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPonentes();
  }, []);

  // 1. Función que SOLO abre el modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  // 2. Función que EJECUTA el borrado real
  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('ponentes')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success("Ponente eliminado correctamente"); // Notificación bonita
      fetchPonentes(); // Recargar lista
      setDeleteId(null); // Cerrar modal

    } catch (error) {
      toast.error("Error al eliminar el ponente");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Ponentes</h1>
            <p className="text-gray-500">Agrega o elimina a los invitados especiales.</p>
          </div>
          
          <Link 
            href="/admin/ponentes/crear" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
          >
            <Plus className="w-5 h-5" /> Nuevo Ponente
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ponentes.map((ponente) => (
              <div key={ponente.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 relative group hover:shadow-md transition">
              {/* ENVOLVEMOS FOTO Y TEXTO EN UN LINK PARA EDITAR */}
              <Link href={`/admin/ponentes/${ponente.id}`} className="flex items-center gap-4 flex-1 cursor-pointer">
                {/* Foto */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                  {ponente.foto_url ? (
                    <img src={ponente.foto_url} alt={ponente.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{ponente.nombre}</h3>
                  <p className="text-sm text-blue-600">{ponente.titulo}</p>
                </div>
            </Link>
                {/* Botón Eliminar (Abre el modal) */}
                <button
                  onClick={() => confirmDelete(ponente.id)} // <--- Llama a la función de abrir modal
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Eliminar Ponente"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {ponentes.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                No hay ponentes registrados aún.
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar Ponente?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Esta acción no se puede deshacer. El ponente dejará de aparecer en la página principal.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteId(null)} // Cancelar: Limpia el ID
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDelete} // Confirmar: Ejecuta el borrado
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex justify-center items-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sí, Eliminar'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}