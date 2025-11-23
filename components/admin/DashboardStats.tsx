'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Clock, Timer } from 'lucide-react';

export default function DashboardStats() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Estado para el tiempo restante formateado
  const [tiempoRestante, setTiempoRestante] = useState<string>('--');
  // Estado para saber si ya estamos muy cerca (para ponerlo en rojo)
  const [esUrgente, setEsUrgente] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        // 1. Obtener Total de Inscritos
        const { count } = await supabase
          .from('registros')
          .select('*', { count: 'exact', head: true });

        setTotalRegistros(count || 0);

        // 2. Obtener Fecha del Evento
        const { data: evento } = await supabase
          .from('datos_generales')
          .select('fecha_evento')
          .single();

        if (evento && evento.fecha_evento) {
          const fechaObjetivo = new Date(evento.fecha_evento).getTime();

          // Función para calcular el tiempo una sola vez
          const calcularTiempo = () => {
            const ahora = new Date().getTime();
            const diferencia = fechaObjetivo - ahora;

            if (diferencia <= 0) {
              setTiempoRestante("¡El evento inició!");
              setEsUrgente(true);
              return;
            }

            // Cálculos matemáticos
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            // Formatear bonito: "05d 12h 30m 45s"
            setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
            
            // Si faltan menos de 3 días, activamos modo urgente
            setEsUrgente(dias < 3);
          };

          // Ejecutamos inmediatamente
          calcularTiempo();

          // Y luego cada 1 segundo (1000ms)
          interval = setInterval(calcularTiempo, 1000);
        }

      } catch (error) {
        console.error('Error cargando stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Limpieza: Cuando sales de la página, matamos el reloj para que no consuma memoria
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Tarjeta 1: Total de Inscritos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between transition hover:shadow-md">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Inscritos</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalRegistros}</h3>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <Users className="w-6 h-6" />
        </div>
      </div>

       {/* Tarjeta 2: Tiempo Restante (Reloj en vivo) */}
       <div className={`p-6 rounded-xl shadow-sm border transition hover:shadow-md flex items-center justify-between
          ${esUrgente ? 'bg-red-50 border-red-100' : 'bg-white border-gray-200'}`}
       >
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${esUrgente ? 'text-red-600' : 'text-gray-500'}`}>
            Tiempo Restante
          </p>
          {loading ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
          ) : (
            // Usamos fuente monoespaciada (font-mono) para que los números no bailen al cambiar
            <h3 className={`text-2xl md:text-3xl font-bold mt-2 font-mono tracking-tight ${esUrgente ? 'text-red-700' : 'text-gray-900'}`}>
              {tiempoRestante}
            </h3>
          )}
        </div>
        <div className={`p-3 rounded-full ${esUrgente ? 'bg-red-200 text-red-700' : 'bg-purple-100 text-purple-600'}`}>
          {esUrgente ? <Timer className="w-6 h-6 animate-pulse" /> : <Clock className="w-6 h-6" />}
        </div>
      </div>
      
    </div>
  );
}