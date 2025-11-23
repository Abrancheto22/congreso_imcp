'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Plus, Trash2, CreditCard, QrCode, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner'; // <--- Importamos Sonner

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPagos = async () => {
    const { data } = await supabase
      .from('pagos')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setPagos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  // 1. Abrir Modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  // 2. Ejecutar Borrado
  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from('pagos').delete().eq('id', deleteId);

      if (error) throw error;

      toast.success("Método de pago eliminado");
      fetchPagos();
      setDeleteId(null);
    } catch (error) {
      toast.error("Error al eliminar");
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
            <h1 className="text-3xl font-bold text-gray-900">Métodos de Pago</h1>
            <p className="text-gray-500">Gestiona las cuentas bancarias y QRs visibles en la web.</p>
          </div>
          
          <Link 
            href="/admin/pagos/crear" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
          >
            <Plus className="w-5 h-5" /> Nuevo Método
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagos.map((pago) => (
              <div key={pago.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group hover:shadow-md transition">
                
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                        {pago.foto_url ? <QrCode /> : <CreditCard />}
                    </div>
                    {/* Botón Borrar (Abre Modal) */}
                    <button
                        onClick={() => confirmDelete(pago.id)}
                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                        title="Eliminar"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{pago.nombre}</h3>
                <p className="text-sm text-gray-500 mb-2">{pago.destinatario}</p>
                
                <div className="bg-gray-100 p-2 rounded text-center font-mono text-gray-800 font-medium tracking-wide text-sm break-all">
                    {pago.numero}
                </div>

                {pago.foto_url && (
                    <div className="mt-4 border-t pt-4 text-center">
                        <span className="text-xs text-green-600 font-bold flex items-center justify-center gap-1">
                            <QrCode className="w-3 h-3" /> Incluye QR
                        </span>
                    </div>
                )}
              </div>
            ))}

            {pagos.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                No hay métodos de pago registrados.
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Eliminar Método?</h3>
              <p className="text-gray-500 text-sm mb-6">
                El método de pago dejará de ser visible para los usuarios en la página de registro.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeDelete}
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