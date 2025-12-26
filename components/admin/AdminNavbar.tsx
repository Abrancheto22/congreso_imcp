'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation'; // <--- Importante: usePathname
import { LogOut, LayoutDashboard, Users, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname(); // Obtenemos la ruta actual

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Función auxiliar para saber si el link está activo
  const isActive = (path: string) => {
    // Caso especial para el dashboard (ruta exacta /admin)
    if (path === '/admin') return pathname === '/admin';
    // Para las otras páginas, verificamos si la ruta actual empieza con el path (ej: /admin/ponentes/crear activa /admin/ponentes)
    return pathname.startsWith(path);
  };

  // Clases comunes para los links
  const linkClass = (path: string) => `
    flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium
    ${isActive(path) 
      ? 'bg-blue-50 text-blue-700' // Estilo Activo
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'} // Estilo Inactivo
  `;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2 font-bold text-gray-800 text-lg hover:opacity-80 transition">
          <span className="bg-blue-600 text-white p-1 rounded">AD</span>
          Panel Admin
        </Link>

        {/* Menú Central */}
        <div className="hidden md:flex gap-2">
          
          <Link href="/admin" className={linkClass('/admin')}>
            <LayoutDashboard className="w-4 h-4" /> Registros
          </Link>
          
          <Link href="/admin/ponentes" className={linkClass('/admin/ponentes')}>
            <Users className="w-4 h-4" /> Ponentes
          </Link>

          <Link href="/admin/evento" className={linkClass('/admin/evento')}>
            <Calendar className="w-4 h-4" /> Evento
          </Link>

          <Link href="/admin/pagos" className={linkClass('/admin/pagos')}>
            <CreditCard className="w-4 h-4" /> Pagos
          </Link>
          <Link href="/admin/donaciones" className={linkClass('/admin/donaciones')}>
            <CreditCard className="w-4 h-4" /> Donaciones
          </Link>

        </div>

        {/* Botón Salir */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>
    </nav>
  );
}