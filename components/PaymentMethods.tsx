'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Copy, Heart, QrCode, X } from 'lucide-react';
import { Pago } from '../types/database';
import { toast } from 'sonner';

export default function PaymentMethods({ pagos }: { pagos: Pago[] }) {
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Número copiado!");
  };

  return (
    <section id="pago" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* COLUMNA IZQUIERDA: IMAGEN INSPIRACIONAL Y TEXTO */}
            <div className="lg:col-span-5 relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
                {/* Imagen de fondo (puedes cambiar esta URL por una foto real de tu iglesia) */}
                <img 
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" 
                    alt="Donaciones" 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                
                {/* Overlay con Gradiente y Texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-10 text-white">
                    <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                        <Heart className="w-6 h-6 text-black fill-black" />
                    </div>
                    <h2 className="text-3xl font-bold mb-3 leading-tight">Siembra en este Proyecto</h2>
                    <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                        "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
                        <br/><span className="font-bold mt-2 block text-yellow-400">- 2 Corintios 9:7</span>
                    </p>
                </div>
            </div>

            {/* COLUMNA DERECHA: TARJETAS DE PAGO */}
            <div className="lg:col-span-7">
                <div className="mb-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Métodos de Donación</h3>
                    <p className="text-gray-500">Selecciona tu método preferido para realizar tu aporte. ¡Gracias por tu generosidad!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pagos.map((pago) => {
                        const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

                        return (
                        <div 
                            key={pago.id} 
                            className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group/card relative overflow-hidden"
                        >
                            {/* Decoración de fondo sutil */}
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-colors ${isWallet ? 'bg-purple-500' : 'bg-blue-500'}`} />

                            {/* Cabecera Tarjeta */}
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className={`p-3 rounded-xl ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isWallet ? <Smartphone className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                </div>
                                {pago.foto_url && (
                                    <button
                                    onClick={() => setSelectedQr(pago.foto_url)}
                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 bg-white border border-gray-200 px-2 py-1 rounded-lg transition shadow-sm hover:shadow-md"
                                    >
                                    <QrCode className="w-3 h-3" /> QR
                                    </button>
                                )}
                            </div>

                            {/* Info */}
                            <div className="relative z-10">
                                <h4 className="font-bold text-gray-900 text-lg">{pago.nombre}</h4>
                                <p className="text-xs text-gray-500 mb-4 line-clamp-1">{pago.destinatario}</p>

                                {/* Botón Copiar */}
                                <button 
                                    onClick={() => handleCopy(pago.numero || '')}
                                    className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 group-hover/card:border-blue-300 transition"
                                >
                                    <span className="font-mono text-gray-800 font-medium tracking-wide text-sm truncate">
                                        {pago.numero}
                                    </span>
                                    <Copy className="w-4 h-4 text-gray-400 group-hover/card:text-blue-500" />
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>

      {/* Modal QR */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedQr(null)}>
          <div className="bg-white p-2 rounded-2xl max-w-xs w-full relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedQr(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={selectedQr} alt="Código QR" className="w-full h-auto" />
            </div>
            <div className="text-center py-4">
                <p className="text-gray-900 font-bold text-sm">Escanea para donar</p>
                <p className="text-gray-400 text-xs">Desde tu aplicativo móvil</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}