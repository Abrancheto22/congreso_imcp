'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import RegistrationsTable from '@/components/admin/RegistrationsTable';
import DashboardStats from '@/components/admin/DashboardStats'; // <--- Importamos

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500">Resumen general y gestión del evento.</p>
        </div>

        {/* 1. Tarjetas de Resumen (Dashboard) */}
        <DashboardStats />

        {/* 2. Tabla de Registros con Buscador */}
        <RegistrationsTable />
      </main>
    </div>
  );
}