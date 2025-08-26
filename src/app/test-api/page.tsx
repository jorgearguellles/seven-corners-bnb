'use client';

import { useState } from 'react';
import { useAvailability, useBooking, useApartment } from '@/hooks/useApi';
import { mockApartment, mockBookingRequest, generateTestDates } from '@/utils/apiTesting';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  
  const availability = useAvailability();
  const booking = useBooking();
  const apartment = useApartment();

  const addTestResult = (testName: string, result: any, success: boolean) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      testName,
      result,
      success,
      timestamp: new Date().toISOString(),
    }]);
  };

  const testAvailability = async () => {
    try {
      const testDates = generateTestDates(7);
      await availability.execute(testDates.check_in, testDates.check_out, mockApartment.id);
      
      if (availability.data) {
        addTestResult('API Availability', availability.data, true);
      }
    } catch (error) {
      addTestResult('API Availability', error, false);
    }
  };

  const testBooking = async () => {
    try {
      const testDates = generateTestDates(14);
      const testData = {
        ...mockBookingRequest,
        check_in: testDates.check_in,
        check_out: testDates.check_out,
      };
      
      await booking.execute(testData);
      
      if (booking.data) {
        addTestResult('API Booking', booking.data, true);
      }
    } catch (error) {
      addTestResult('API Booking', error, false);
    }
  };

  const testApartment = async () => {
    try {
      await apartment.execute(mockApartment.id);
      
      if (apartment.data) {
        addTestResult('API Apartment', apartment.data, true);
      }
    } catch (error) {
      addTestResult('API Apartment', error, false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🧪 Testing de APIs - Fase 2
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pruebas de API Routes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testAvailability}
              disabled={availability.loading}
              className="btn-primary disabled:opacity-50"
            >
              {availability.loading ? 'Probando...' : 'Test Availability API'}
            </button>
            
            <button
              onClick={testBooking}
              disabled={booking.loading}
              className="btn-primary disabled:opacity-50"
            >
              {booking.loading ? 'Probando...' : 'Test Booking API'}
            </button>
            
            <button
              onClick={testApartment}
              disabled={apartment.loading}
              className="btn-primary disabled:opacity-50"
            >
              {apartment.loading ? 'Probando...' : 'Test Apartment API'}
            </button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={clearResults}
              className="btn-secondary"
            >
              Limpiar Resultados
            </button>
          </div>
        </div>

        {/* Estados de Loading */}
        {(availability.loading || booking.loading || apartment.loading) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Ejecutando pruebas...</span>
            </div>
          </div>
        )}

        {/* Errores */}
        {(availability.error || booking.error || apartment.error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Errores Encontrados:</h3>
            {availability.error && (
              <p className="text-red-700">Availability: {availability.error}</p>
            )}
            {booking.error && (
              <p className="text-red-700">Booking: {booking.error}</p>
            )}
            {apartment.error && (
              <p className="text-red-700">Apartment: {apartment.error}</p>
            )}
          </div>
        )}

        {/* Resultados de las Pruebas */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Resultados de las Pruebas ({testResults.length})
            </h2>
            
            <div className="space-y-4">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className={`border rounded-lg p-4 ${
                    result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.testName}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}>
                      {result.success ? '✅ Exitoso' : '❌ Falló'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                  
                  <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información de la Fase 2 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            📋 Estado de la Fase 2: Backend y Base de Datos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">✅ Completado:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• API Route /api/availability</li>
                <li>• API Route /api/book</li>
                <li>• API Route /api/apartment</li>
                <li>• API Route /api/reservations</li>
                <li>• Hooks personalizados para APIs</li>
                <li>• Utilidades de testing</li>
                <li>• Funciones SQL RPC para performance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">🚀 Próximos Pasos:</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Testing del backend</li>
                <li>• Validación de lógica de negocio</li>
                <li>• Integración con Supabase</li>
                <li>• Optimización de consultas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
