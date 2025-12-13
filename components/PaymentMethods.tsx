'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Copy, Heart, QrCode, X } from 'lucide-react';
import { Pago, DatosGenerales } from '../types/database'; 
import { toast } from 'sonner';

export default function PaymentMethods({ pagos, datosGenerales }: { pagos: Pago[], datosGenerales: DatosGenerales | null }) {
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Copiado!");
  };
  
  const imagesToShow = datosGenerales?.donacion_imagenes && datosGenerales.donacion_imagenes.length > 0 
    ? datosGenerales.donacion_imagenes 
    : ["https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"];

  // Usamos siempre la primera imagen fija
  const staticImage = imagesToShow[0];

  return (
    <section id="pago" className="py-20 bg-gray-50 relative px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* --- TARJETA UNIFICADA --- */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden relative isolate">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                
                {/* LADO IZQUIERDO: IMAGEN */}
                <div className="lg:col-span-5 relative group bg-gray-100 lg:h-full">
                    
                    {/* Contenedor de la imagen */}
                    {/* CAMBIO CLAVE: Quitamos 'h-full' fijo en móvil para que el contenedor crezca con la imagen */}
                    <div className="w-full relative lg:h-full">
                        <img 
                            src={staticImage} 
                            alt={`Fondo Donación`} 
                            // CAMBIO IMPORTANTE:
                            // Móvil: 'relative w-full h-auto' -> La imagen empuja el contenedor y se ve completa.
                            // Desktop (lg): 'lg:absolute lg:inset-0 lg:h-full lg:object-cover' -> Se adapta a la columna lateral.
                            className="relative w-full h-auto lg:absolute lg:inset-0 lg:h-full lg:object-cover transition duration-1000 block"
                        />
                    </div>

                    {/* DEGRADADO NARANJA + TEXTO */}
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 via-orange-900/20 to-transparent pointer-events-none flex items-end">
                        <div className="p-8 w-full pb-10">
                            <h3 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg mb-2 leading-tight font-sans">
                                Nuestro sueño
                            </h3>
                            <p className="text-white/90 text-sm font-medium tracking-wide drop-shadow-md mb-4 leading-relaxed max-w-md">
                                Construir un lugar donde las personas puedan experimentar el amor y la presencia de Dios, y crecer en fe y compromiso con Él.
                            </p>
                            <div className="h-1.5 w-20 bg-yellow-400 rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: CONTENIDO (7 Columnas) */}
                <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
                    
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Canales de Donación</h3>
                        <p className="text-sm text-gray-500">
                            Tu aporte nos ayuda a seguir adelante. Elige tu medio de preferencia:
                        </p>
                    </div>

                    {/* Lista de Pagos */}
                    <div className="flex flex-col gap-3 mb-8">
                        {pagos.map((pago) => {
                            const isWallet = pago.nombre.toLowerCase().includes('yape') || pago.nombre.toLowerCase().includes('plin');

                            return (
                            <div 
                                key={pago.id} 
                                className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md hover:bg-white transition-all duration-300 group/card flex flex-col sm:flex-row items-center gap-4"
                            >
                                <div className={`p-3 rounded-lg flex-shrink-0 ${isWallet ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isWallet ? <Smartphone className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                </div>

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

                    {/* BLOQUE DE SIEMBRA */}
                    <div className="mt-4 pt-6 border-t border-gray-100 animate-fade-in-up">
                        <div className="flex gap-4 items-start">
                            {/* Icono Corazón Amarillo */}
                            <div className="bg-yellow-100 p-3 rounded-full flex-shrink-0 hidden sm:flex">
                                <Heart className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <span className="sm:hidden text-yellow-500">❤️</span>
                                    Siembra en este Proyecto
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-yellow-500">
                                    <p className="text-gray-600 text-sm italic leading-relaxed">
                                        "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre."
                                    </p>
                                    <p className="text-yellow-600 text-xs font-bold mt-2 uppercase tracking-wider">
                                        – 2 Corintios 9:7
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

      </div>

      {/* Modal QR */}
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