'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, Search, X, CheckCircle, Clock, Eye, Download, MessageCircle, FileSpreadsheet, FileText, Filter, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/export';
import { exportToPdf } from '@/lib/pdfExport';

export default function RegistrationsTable() {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); // 'todos' | 'Pendiente' | 'Confirmado'
  
  // Filtros Avanzados (Opcionales, recomendados)
  const [iglesiaFilter, setIglesiaFilter] = useState(''); // Texto libre para iglesia

  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchRegistros = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registros')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRegistros(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegistros();
  }, []);


  const handleConfirmar = async () => {
    if (!selectedReg) return;
    setProcessing(true);

    try {
      const { error } = await supabase
        .from('registros')
        .update({ estado: 'Confirmado' })
        .eq('id', selectedReg.id);

      if (error) throw error;

      const updatedRegistros = registros.map(r => 
        r.id === selectedReg.id ? { ...r, estado: 'Confirmado' } : r
      );
      setRegistros(updatedRegistros);
      setSelectedReg({ ...selectedReg, estado: 'Confirmado' });
      
      toast.success("¡Registro confirmado exitosamente!");
    } catch (error) {
      toast.error("Hubo un error al confirmar el registro");
    } finally {
      setProcessing(false);
    }
  };

  // Lógica de Filtrado Múltiple
  const filteredRegistros = registros.filter((reg) => {
    const term = searchTerm.toLowerCase();
    
    // 1. Filtro de Texto (Nombre, Ubicación)
    const matchesSearch = 
      reg.nombre_completo.toLowerCase().includes(term) ||
      (reg.departamento && reg.departamento.toLowerCase().includes(term));

    // 2. Filtro de Estado
    const matchesStatus = 
      statusFilter === 'todos' || 
      (reg.estado || 'Pendiente') === statusFilter;

    // 3. Filtro de Iglesia (si se escribió algo)
    const matchesIglesia = 
        iglesiaFilter === '' || 
        (reg.iglesia && reg.iglesia.toLowerCase().includes(iglesiaFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesIglesia;
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Cabecera Principal */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 space-y-4">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">Inscripciones</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {filteredRegistros.length}
                    </span>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Botones Exportar */}
                    <button onClick={() => exportToExcel(registros)} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition" title="Excel">
                        <FileSpreadsheet className="w-5 h-5" />
                    </button>
                    <button onClick={() => exportToPdf(registros, 'Reporte')} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition" title="PDF">
                        <FileText className="w-5 h-5" />
                    </button>
                    <button onClick={fetchRegistros} className="p-2 text-gray-500 hover:text-blue-600 bg-white border rounded-lg">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="flex flex-col md:flex-row gap-3">
                
                {/* Buscador General */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o departamento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Filtro de Estado (Select) */}
                <div className="relative w-full md:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`w-full pl-3 pr-8 py-2 border rounded-lg text-sm focus:ring-2 outline-none appearance-none cursor-pointer font-medium
                            ${statusFilter === 'Confirmado' ? 'border-green-200 bg-green-50 text-green-700 focus:ring-green-500' : 
                              statusFilter === 'Pendiente' ? 'border-yellow-200 bg-yellow-50 text-yellow-700 focus:ring-yellow-500' : 
                              'border-gray-300 bg-white text-gray-700 focus:ring-blue-500'}`}
                    >
                        <option value="todos">Todos los Estados</option>
                        <option value="Pendiente">⏳ Pendientes</option>
                        <option value="Confirmado">✅ Confirmados</option>
                    </select>
                    <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Filtro de Iglesia (Extra) */}
                <div className="relative w-full md:w-48">
                    <input
                        type="text"
                        placeholder="Filtrar por Iglesia..."
                        value={iglesiaFilter}
                        onChange={(e) => setIglesiaFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

            </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Nombre / WhatsApp</th>
                <th className="px-6 py-4">Ubicación / Iglesia</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistros.map((reg) => (
                <tr key={reg.id} className="bg-white hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {reg.estado === 'Confirmado' ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Confirmado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold border border-yellow-200">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reg.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    <span className="text-xs text-gray-400 ml-1">{new Date(reg.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{reg.nombre_completo}</p>
                    <button 
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 mt-1 transition"
                    >
                        <MessageCircle className="w-3 h-3" /> {reg.numero}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{reg.departamento}</span>
                        <span className="text-xs text-gray-500">{reg.iglesia}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedReg(reg)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center mx-auto gap-1 border border-blue-200"
                    >
                      <Eye className="w-4 h-4" /> Ver
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRegistros.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          No se encontraron registros con esos filtros.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE DETALLES --- */}
      {selectedReg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Detalles de Inscripción</h3>
                <p className="text-sm text-gray-500">ID: {selectedReg.id.slice(0,8)}...</p>
              </div>
              <button onClick={() => setSelectedReg(null)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Nombre Completo</label>
                  <p className="text-lg font-medium text-gray-900">{selectedReg.nombre_completo}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Estado Actual</label>
                  <div className="mt-1">
                    {selectedReg.estado === 'Confirmado' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">Confirmado</span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">Pendiente de Revisión</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Celular / WhatsApp</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-900 text-lg">{selectedReg.numero}</p>
                    <button 
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full transition"
                        title="Abrir Chat"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Ubicación</label>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <p className="text-gray-900 font-medium">{selectedReg.departamento}</p>
                  </div>
                  <p className="text-sm text-gray-500 pl-5">{selectedReg.ciudad || ''} {selectedReg.provincia ? `(${selectedReg.provincia})` : ''}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Iglesia</label>
                  <p className="text-gray-900">{selectedReg.iglesia || '-'}</p>
                </div>
                
                <div className="flex gap-8">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Edad</label>
                        <p className="text-gray-900 font-medium">{selectedReg.edad} años</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Género</label>
                        <p className="text-gray-900 font-medium">{selectedReg.genero || '-'}</p>
                    </div>
                </div>

              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Comprobantes de Pago
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    const vouchers = Array.isArray(selectedReg.voucher_url) 
                        ? selectedReg.voucher_url 
                        : (selectedReg.voucher_url ? [selectedReg.voucher_url] : []);
                    
                    if (vouchers.length === 0) return <p className="text-gray-400 italic text-sm">No hay archivos adjuntos.</p>;

                    return vouchers.map((url: string, idx: number) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="group relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition"
                      >
                        <img src={url} alt={`Voucher ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                            <Eye className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                        </div>
                      </a>
                    ));
                  })()}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Cerrar
              </button>
              
              {selectedReg.estado !== 'Confirmado' && (
                <button 
                  onClick={handleConfirmar}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {processing ? 'Procesando...' : (
                    <>
                        <CheckCircle className="w-4 h-4" /> Confirmar Pago
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}