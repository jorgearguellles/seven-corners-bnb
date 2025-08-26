# 📑 SPEC Técnico -- MVP Sistema de Reservas de Hospedaje

## 🎯 Objetivo del Proyecto

Construir una **web de una sola página (SPA)** que permita a usuarios
consultar disponibilidad y reservar noches en un apartamento, con pagos
integrados y un panel de administración para el dueño (Ve reservas, ponme precios por noche, por mes, por semana, por temporada, ve metricas del negocio).

---

## ⚙️ Alcance del MVP

- **Frontend (Next.js + TailwindCSS):**
  - Landing page con descripción del apartamento, fotos y CTA de
    reservar.
  - Calendario interactivo mostrando noches disponibles/ocupadas.
  - Formulario de reserva con selección de fechas.
  - Integración de pago (Stripe Checkout).
  - Confirmación de reserva con correo al cliente.
- **Backend (Next.js API Routes + Supabase):**
  - Endpoints de disponibilidad (`/api/availability`).
  - Endpoint de reservas (`/api/book`).
  - Validación de conflictos de fechas en tiempo real.
  - Gestión de usuarios (solo 1 rol: dueño).
- **Base de Datos (Supabase / Postgres):**
  - Tabla `apartments` → info del apartamento (nombre, descripción,
    fotos, precio por noche).
  - Tabla `reservations` → id, fecha_inicio, fecha_fin, cliente,
    estado_pago.
  - Tabla `users` (solo admin).
- **Pagos (Stripe):**
  - Integración con Checkout preconfigurado.
  - Webhooks para confirmar transacciones y actualizar estado de
    reservas.

---

## 📐 Arquitectura General

- **Frontend:** Next.js (App Router) + TailwindCSS (UX y UI basad en AirBnB).
- **Backend:** API Routes en Next.js (serverless).
- **DB:** Supabase Postgres (con RLS para seguridad).
- **Auth:** Supabase Auth (sólo admin).
- **Payments:** Stripe.
- **Deploy:** Vercel (Frontend + API) + Supabase (DB).

---

## 🔒 Restricciones

- El MVP solo maneja **un apartamento único**.
- No hay login para usuarios; solo formulario de reservas.
- El dueño administra desde el dashboard de Supabase directamente (sin
  panel UI personalizado, hace logind desde un boton en el footer).
- Máxima simplicidad: optimizado para validar la idea en producción.

---

## 🗂️ Flujo de Usuario

1.  Cliente entra a la landing.
2.  Visualiza calendario con disponibilidad.
3.  Selecciona noches deseadas → clic en "Reservar".
4.  Rellena formulario (nombre, email, ID o Passport).
5.  Es redirigido a Stripe Checkout.
6.  Al pagar → Stripe notifica vía webhook → se marca como reservado en
    DB.
7.  Cliente recibe correo de confirmación.

---

## ✅ Éxito del MVP

- El cliente puede reservar y pagar sin fricción.\
- El dueño puede ver reservas en Supabase.\
- Noches ocupadas se bloquean automáticamente.
