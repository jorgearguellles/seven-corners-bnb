import Image from "next/image";

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
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ✅ Fase 1 Completada
          </h2>
          <p className="text-gray-600 mb-4">
            Proyecto configurado exitosamente con:
          </p>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• Next.js 14 + TypeScript</li>
            <li>• TailwindCSS v4</li>
            <li>• Supabase + Stripe</li>
            <li>• ESLint + Prettier</li>
            <li>• Estructura de carpetas</li>
          </ul>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">
              🚀 Listo para continuar con la Fase 2
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
