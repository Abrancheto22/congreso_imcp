import LoginForm from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 relative overflow-hidden">
      
      {/* (Opcional) Decoración de fondo para que no se vea tan plano */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      {/* Cargamos el componente limpio */}
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
      
    </div>
  );
}