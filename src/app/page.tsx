import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🏠 Seven Corners BnB
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema de Reservas de Hospedaje
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🚀 Progreso del Proyecto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Fase 1 */}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                ✅ Fase 1: Configuración y Estructura Base
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Next.js 14 + TypeScript</li>
                <li>• TailwindCSS v3</li>
                <li>• Supabase + Stripe</li>
                <li>• ESLint + Prettier</li>
                <li>• Estructura de carpetas</li>
              </ul>
            </div>
            
            {/* Fase 2 */}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                🔄 Fase 2: Backend y Base de Datos
              </h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• API Routes completadas</li>
                <li>• Lógica de negocio</li>
                <li>• Hooks personalizados</li>
                <li>• Funciones SQL RPC</li>
                <li>• Utilidades de testing</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              🧪 Testing del Backend
            </h3>
            <p className="text-blue-700 mb-4">
              Se ha creado una página de testing para validar todas las APIs del backend.
            </p>
            <Link 
              href="/test-api" 
              className="btn-primary inline-block"
            >
              Ir a Testing de APIs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">API Routes</h4>
              <p className="text-green-700 text-sm">4 endpoints implementados</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Hooks</h4>
              <p className="text-blue-700 text-sm">4 hooks personalizados</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Testing</h4>
              <p className="text-purple-700 text-sm">Utilidades y mocks</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-800 font-medium">
              🎯 Próximo: Fase 3 - Frontend (Landing y Calendario)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
