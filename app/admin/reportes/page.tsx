import AdminNavbar from '@/components/admin/AdminNavbar';
import Reports from '@/components/admin/Reports';

export default function ReportesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <Reports />
      </div>
    </div>
  );
}
