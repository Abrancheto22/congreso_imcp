'use client';

import { useState } from 'react';
import { Pago } from '@/types/database';
import { Copy, CreditCard, Smartphone, QrCode, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSidebar({ pagos }: { pagos: Pago[] }) {
  const [qrOpen, setQrOpen] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Número de cuenta copiado!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">¡Ya casi estás dentro!</h1>
        <p className="text-blue-800 text-sm mb-4">
            Sigue estos pasos para asegurar tu lugar:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-blue-900 font-medium text-sm">
            <li>Realiza el pago a una cuenta abajo.</li>
            <li>Toma captura o foto al comprobante.</li>
            <li>Llena el formulario y adjunta la foto.</li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Cuentas Disponibles
        </h3>
        
        <div className="space-y-4">
            {pagos.map((pago) => {
                const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

                return (
                    <div key={pago.id} className="group border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition duration-300">
                        {/* Cabecera Banco */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isWallet ? <Smartphone className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{pago.nombre}</span>
                            </div>
                            {pago.foto_url && (
                                <button 
                                    onClick={() => setQrOpen(pago.foto_url)}
                                    className="text-[10px] font-bold uppercase bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded flex items-center gap-1 transition"
                                >
                                    <QrCode className="w-3 h-3" /> Ver QR
                                </button>
                            )}
                        </div>
                        
                        {/* Titular */}
                        <p className="text-xs text-gray-500 mb-2 pl-9">{pago.destinatario}</p>

                        {/* Número con Copiar */}
                        <div 
                            onClick={() => handleCopy(pago.numero || '')}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-blue-300 transition group/copy"
                        >
                            <span className="font-mono text-gray-800 font-medium tracking-wide text-sm truncate">
                                {pago.numero}
                            </span>
                            <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-blue-600 transition" />
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* MODAL QR (Pequeño y rápido) */}
      {qrOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setQrOpen(null)}>
            <div className="bg-white p-2 rounded-xl max-w-xs w-full relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <button onClick={() => setQrOpen(null)} className="absolute -top-10 right-0 text-white"><X /></button>
                <img src={qrOpen} className="w-full rounded-lg" />
                <p className="text-center text-xs text-gray-500 mt-2 font-medium">Escanea para pagar</p>
            </div>
        </div>
      )}
    </div>
  );
}