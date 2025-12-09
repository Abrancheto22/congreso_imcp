'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Copy, Heart, QrCode, X, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Pago } from '../types/database';
import { toast } from 'sonner';

export default function PaymentMethods({ pagos }: { pagos: Pago[] }) {
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado!");
  };

  return (
    <section id="pago" className="py-20 bg-gray-50/50 relative px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* --- TARJETA UNIFICADA (CONTENEDOR PRINCIPAL) --- */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden relative isolate">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                
                {/* LADO IZQUIERDO: IMAGEN (Ocupa toda la altura) */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:h-full group">
                    <img 
                        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800" 
                        alt="Fondo Donaciones" 
                        className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Overlay Degradado y Texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-10 text-white">
                        <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                            <Heart className="w-6 h-6 text-black fill-black" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3 leading-tight">
                            Siembra en este Proyecto
                        </h2>
                        <p className="text-blue-100 text-sm leading-relaxed opacity-90 font-medium italic border-l-4 border-yellow-500 pl-4">
                            "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
                            <br/> <span className="text-yellow-400 not-italic mt-2 block font-bold">– 2 Corintios 9:7</span>
                        </p>
                    </div>
                </div>

                {/* LADO DERECHO: CONTENIDO (Lista y Contacto) */}
                <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
                    
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Canales de Donación</h3>
                        <p className="text-sm text-gray-500">
                            Tu aporte nos ayuda a seguir adelante. Elige tu medio de preferencia:
                        </p>
                    </div>

                    {/* Lista de Pagos (Compacta) */}
                    <div className="flex flex-col gap-3 mb-8">
                        {pagos.map((pago) => {
                            const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

                            return (
                            <div 
                                key={pago.id} 
                                className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md hover:bg-white transition-all duration-300 group/card flex flex-col sm:flex-row items-center gap-4"
                            >
                                {/* Icono */}
                                <div className={`p-3 rounded-lg flex-shrink-0 ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isWallet ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left w-full overflow-hidden">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                                        <h4 className="font-bold text-gray-900 text-base">{pago.nombre}</h4>
                                        {pago.foto_url && (
                                            <button
                                                onClick={() => setSelectedQr(pago.foto_url)}
                                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 transition"
                                            >
                                                <QrCode className="w-3 h-3" /> QR
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{pago.destinatario}</p>
                                </div>

                                {/* Botón Copiar */}
                                <div className="w-full sm:w-auto">
                                    <button 
                                        onClick={() => handleCopy(pago.numero || '')}
                                        className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-3 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-lg px-4 py-2 transition text-gray-600 font-mono text-sm tracking-wide group/copy"
                                    >
                                        <span>{pago.numero}</span>
                                        <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-blue-500" />
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>

                    {/* Footer Interno (Contacto) */}
                    <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold text-gray-900">¿Tienes dudas?</p>
                            <p className="text-[10px] text-gray-400">Contáctanos por redes sociales.</p>
                        </div>
                        <div className="flex gap-2">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-400 transition">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-pink-600 hover:text-white flex items-center justify-center text-gray-400 transition">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-green-600 hover:text-white flex items-center justify-center text-gray-400 transition">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>

      </div>

      {/* Modal QR (Sin cambios) */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedQr(null)}>
          <div className="bg-white p-2 rounded-2xl max-w-xs w-full relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedQr(null)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"><X className="w-8 h-8" /></button>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img src={selectedQr} alt="Código QR" className="w-full h-auto" />
            </div>
            <div className="text-center py-4">
                <p className="text-gray-900 font-bold text-sm">Escanea para donar</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}