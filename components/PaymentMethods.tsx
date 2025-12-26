'use client';

import { useState } from 'react';
import { Copy, Check, Smartphone, CreditCard, Building2, ExternalLink, QrCode, X, User } from 'lucide-react';
import { Pago, DatosGenerales } from '../types/database';
import { toast } from 'sonner';

interface PaymentMethodsProps {
  pagos: Pago[];
  datosGenerales: DatosGenerales | null;
}

export default function PaymentMethods({ pagos, datosGenerales }: PaymentMethodsProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (text: string, id: number) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isDigitalWallet = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('yape') || n.includes('plin');
  };

  // Nombre del titular principal para mostrarlo de forma global si se desea
  const titularPrincipal = pagos[0]?.destinatario || "Sarita B. Mantilla R.";

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
      
      {/* NOTA ACLARATORIA GLOBAL */}
      <div className="mb-8 flex items-center justify-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800">
          <User className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Todas las aportaciones y transferencias son de forma voluntaria y agradecemos su apoyo
          </p>
      </div>

      {/* MODAL DE QR */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedQr(null)}>
            <div className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedQr(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition">
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Código QR</h3>
                    <p className="text-sm text-gray-500">Escanea para realizar tu donación a {titularPrincipal}</p>
                </div>
                <div className="aspect-square bg-white rounded-2xl overflow-hidden border-4 border-gray-50 shadow-inner">
                    <img src={selectedQr} alt="QR" className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
      )}

      {/* GRID COMPACTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. MERCADO PAGO */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Mercado Pago</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-bold"> Iglesia Príncipe de Paz</p>
                </div>
            </div>
            <a 
                href="https://link.mercadopago.com.pe/iglesiaprincipedepaz" 
                target="_blank" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
                Pagar <ExternalLink className="w-3 h-3" />
            </a>
        </div>

        {/* 2. BANCOS Y BILLETERAS */}
        {pagos.map((pago) => {
            const isWallet = isDigitalWallet(pago.nombre);
            return (
                <div key={pago.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${isWallet ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-400'}`}>
                            {isWallet ? <Smartphone className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-gray-900 text-sm truncate">{pago.nombre}</h3>
                            <p className="text-[10px] text-gray-400 font-mono truncate mb-1">{pago.numero}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">{pago.destinatario}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        {isWallet && pago.foto_url && (
                            <button 
                                onClick={() => setSelectedQr(pago.foto_url || '')}
                                className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                                title="Ver QR"
                            >
                                <QrCode className="w-4 h-4" />
                            </button>
                        )}
                        <button 
                            onClick={() => handleCopy(pago.numero || '', pago.id)}
                            className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition"
                        >
                            {copiedId === pago.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            );
        })}

      </div>
    </div>
  );
}