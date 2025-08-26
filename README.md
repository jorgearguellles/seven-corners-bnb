# 🏠 Seven Corners BnB - Sistema de Reservas

Sistema de reservas de hospedaje desarrollado con Next.js, Supabase y Stripe.

## 🚀 Características

- Landing page moderna inspirada en AirBnB
- Calendario interactivo para selección de fechas
- Sistema de reservas con validación en tiempo real
- Integración de pagos con Stripe
- Panel de administración para el dueño
- Diseño responsive y optimizado para móviles

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS v4
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Pagos**: Stripe Checkout
- **Deploy**: Vercel

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe

## ⚙️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd 7cornersBnB
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp env.example .env.local
   ```

   Editar `.env.local` con tus credenciales:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio_supabase
   STRIPE_SECRET_KEY=tu_clave_secreta_stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
   STRIPE_WEBHOOK_SECRET=tu_secreto_webhook_stripe
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configurar Supabase**
   - Crear proyecto en [Supabase](https://supabase.com)
   - Ejecutar el script SQL de `supabase-schema.sql` en el SQL Editor
   - Configurar autenticación y políticas RLS

5. **Configurar Stripe**
   - Crear cuenta en [Stripe](https://stripe.com)
   - Configurar webhooks apuntando a `/api/webhooks/stripe`
   - Obtener claves de API

## 🚀 Desarrollo

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint

# Formatear código
npm run format
```

## 📁 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── api/            # API Routes
│   ├── globals.css     # Estilos globales
│   └── layout.tsx      # Layout principal
├── components/          # Componentes reutilizables
├── lib/                # Configuraciones (Supabase, Stripe)
├── types/              # Tipos TypeScript
├── utils/              # Utilidades y helpers
└── hooks/              # Custom hooks
```

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Validación de datos en frontend y backend
- Autenticación requerida para operaciones admin
- Webhooks de Stripe verificados

## 📱 Testing

Cada fase del desarrollo incluye testing específico:

- **Fase 1-2**: Testing de backend y API
- **Fase 3**: Testing de usabilidad del frontend
- **Fase 4**: Testing del flujo de pagos
- **Fase 5**: Testing del panel admin
- **Fase 6**: Testing integral con usuarios reales

## 🚀 Deploy

1. **Vercel** (recomendado)
   - Conectar repositorio de GitHub
   - Configurar variables de entorno
   - Deploy automático

2. **Configurar webhooks**
   - Actualizar URL de webhook en Stripe
   - Verificar funcionamiento

## 📊 Estado del Proyecto

- [x] Fase 1: Configuración y Estructura Base
- [ ] Fase 2: Backend y Base de Datos
- [ ] Fase 3: Frontend - Landing y Calendario
- [ ] Fase 4: Integración de Pagos
- [ ] Fase 5: Panel de Administración
- [ ] Fase 6: Testing Integral
- [ ] Fase 7: Deploy y Lanzamiento

## 🤝 Contribución

Este es un proyecto MVP. Las contribuciones son bienvenidas después del lanzamiento inicial.

## 📄 Licencia

Privada - Todos los derechos reservados.
