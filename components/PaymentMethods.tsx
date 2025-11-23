'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Copy, Check, QrCode, X } from 'lucide-react';
import { Pago } from '../types/database';
import { toast } from 'sonner';

export default function PaymentMethods({ pagos }: { pagos: Pago[] }) {
  // Estado para saber qué QR se está viendo (si es null, el modal está cerrado)
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Número de cuenta copiado!");
  };

  return (
    <section id="pago" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Métodos de Pago
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Facilitamos tu inscripción con múltiples opciones. Realiza tu depósito o transferencia y guarda el comprobante para registrarte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pagos.map((pago) => {
            // Detectamos si es Yape/Plin para cambiar el estilo
            const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

            return (
              <div 
                key={pago.id} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  {/* Icono */}
                  <div className={`p-4 rounded-xl ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isWallet ? <Smartphone className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
                  </div>
                  
                  {/* Botón QR (Si tiene foto) */}
                  {pago.foto_url && (
                    <button
                      onClick={() => setSelectedQr(pago.foto_url)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-full transition"
                    >
                      <QrCode className="w-4 h-4" /> Ver QR
                    </button>
                  )}
                </div>

                {/* Nombre Banco */}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{pago.nombre}</h3>
                <p className="text-gray-500 text-sm mb-6">Titular: <span className="font-medium text-gray-700">{pago.destinatario}</span></p>

                {/* Número de Cuenta con Copiar */}
                <div className="relative">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 font-mono text-lg text-gray-800 tracking-wide break-all">
                    {pago.numero}
                  </div>
                  <button 
                    onClick={() => handleCopy(pago.numero || '')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Copiar número"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 text-xs text-center text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  Click en el ícono para copiar
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL PARA VER EL QR --- */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedQr(null)}>
          <div className="bg-white p-2 rounded-2xl max-w-sm w-full relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedQr(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={selectedQr} alt="Código QR" className="w-full h-auto" />
            </div>
            <p className="text-center text-gray-500 text-sm py-4 font-medium">
              Escanea desde tu aplicativo
            </p>
          </div>
        </div>
      )}
    </section>
  );
}