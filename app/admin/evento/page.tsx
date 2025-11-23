'use client';

import AdminNavbar from '@/components/admin/AdminNavbar';
import EventForm from '@/components/admin/EventForm';

export default function AdminEventoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Evento</h1>
          <p className="text-gray-500">Edita los detalles principales que aparecen en la portada.</p>
        </div>

        {/* Cargamos el formulario */}
        <EventForm />
      </main>
    </div>
  );
}