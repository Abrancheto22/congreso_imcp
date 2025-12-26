'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pago } from '@/types/database';
// Agregamos AlertCircle para la advertencia
import { Copy, CreditCard, Smartphone, QrCode, X, Utensils, Bed, Bus, Info, Ticket, ExternalLink, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSidebar({ pagos }: { pagos: Pago[] }) {
  const [qrOpen, setQrOpen] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado al portapapeles!");
  };

  return (
    <div className="space-y-5">
      
      {/* 1. TARJETA "TICKET" */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-md text-blue-900 overflow-hidden relative">
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
        
        <div className="p-4 text-center border-b border-blue-900/10 border-dashed relative">
            <h2 className="font-bold uppercase tracking-wider text-[15px] mb-0.5 opacity-80 flex items-center justify-center gap-1.5">
                <Ticket className="w-4 h-4" /> Valor de Inscripción
            </h2>
            <div className="flex items-center justify-center gap-0.5">
                <span className="text-2xl font-bold">S/</span>
                <span className="text-5xl font-black tracking-tighter">150</span>
                <span className="text-lg font-bold self-start mt-1.5">.00</span>
            </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-4">
            <p className="text-center text-[12px] text-gray-500 font-bold uppercase tracking-widest mb-3">Incluye:</p>
            <ul className="space-y-2">
                <li className="flex items-center gap-2.5 text-xs font-bold text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-yellow-100/50">
                    <div className="bg-orange-100 p-1.5 rounded-md text-orange-600 flex-shrink-0">
                        <Utensils className="w-3.5 h-3.5" />
                    </div>
                    Alimentación Completa
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-yellow-100/50">
                    <div className="bg-blue-100 p-1.5 rounded-md text-blue-600 flex-shrink-0">
                        <Bed className="w-3.5 h-3.5" />
                    </div>
                    Estadía / Hospedaje
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-yellow-100/50">
                    <div className="bg-green-100 p-1.5 rounded-md text-green-600 flex-shrink-0">
                        <Bus className="w-3.5 h-3.5" />
                    </div>
                    Movilización Interna
                </li>
            </ul>
        </div>
      </div>

      {/* 2. ZONA DE PAGO */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-start gap-3">
            <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-100 text-blue-600">
                <Info className="w-4 h-4" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">Instrucciones</h3>
                <p className="text-xs text-gray-500 leading-tight">
                    1. Realiza el depósito.<br/>
                    2. <strong>Toma captura</strong> al comprobante.<br/>
                    3. Súbela en el formulario.
                </p>
            </div>
        </div>

        <div className="p-4 space-y-3">
            
            {/* --- MERCADO PAGO CON ADVERTENCIA DE COMISIÓN --- */}
            <div className="relative group overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-[1px] shadow-sm transition-all hover:shadow-md">
                <div className="bg-white rounded-[10px] p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase flex items-center gap-1">
                        <Zap className="w-2 h-2 fill-white" /> Online
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-xs">Mercado Pago</p>
                            <p className="text-[10px] text-gray-400">Tarjetas y Pago Instantáneo</p>
                        </div>
                    </div>

                    {/* MENSAJE DE ADVERTENCIA DE COMISIÓN */}
                    <div className="mb-3 flex items-start gap-1.5 bg-amber-50 border border-amber-100 p-2 rounded-lg">
                        <AlertCircle className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-[9px] text-amber-700 leading-tight font-bold">
                            Esta opción incluye una comisión por procesamiento de pago en línea.
                        </p>
                    </div>

                    <a 
                        href="https://mpago.la/1j9Auad" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-transform active:scale-95 shadow-sm"
                    >
                        PAGAR AHORA <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-2 my-2">
                <div className="h-[1px] bg-gray-100 flex-1"></div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Otras cuentas</span>
                <div className="h-[1px] bg-gray-100 flex-1"></div>
            </div>

            {/* Lista de Cuentas Manuales (Yape, BCP, etc.) */}
            {pagos.map((pago) => {
                const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

                return (
                    <div key={pago.id} className="group border border-gray-100 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-lg ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isWallet ? <Smartphone className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-xs leading-none mb-0.5">{pago.nombre}</p>
                                    <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{pago.destinatario}</p>
                                </div>
                            </div>
                            {pago.foto_url && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setQrOpen(pago.foto_url || null); }}
                                    className="font-bold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <QrCode className="w-3.5 h-3.5" />
                                    <span className="text-xs">QR</span>
                                </button>
                            )}
                        </div>
                        
                        <button 
                            onClick={() => handleCopy(pago.numero || '')}
                            className="w-full flex items-center justify-between bg-gray-50 group-hover:bg-blue-50/50 border border-transparent group-hover:border-blue-100 rounded-lg px-3 py-2 cursor-pointer transition"
                        >
                            <span className="font-mono text-gray-800 font-bold text-xs tracking-wide">
                                {pago.numero}
                            </span>
                            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 group-hover:text-blue-500 font-medium">
                                COPIAR <Copy className="w-3 h-3" />
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Modal QR */}
      {typeof window !== 'undefined' && qrOpen && createPortal(
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-[9999]" 
          onClick={() => setQrOpen(null)}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"></div>
            <div 
              className="bg-white p-4 rounded-xl max-w-xs w-full relative animate-in zoom-in-95 shadow-2xl z-10" 
              onClick={e => e.stopPropagation()}
            >
                <button 
                  onClick={() => setQrOpen(null)} 
                  className="absolute -top-10 right-0 text-white hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <img src={qrOpen} className="w-full rounded-lg" alt="QR Pago" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                <p className="text-center text-xs text-gray-500 mt-2 font-medium">Escanea para pagar</p>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
}