# Opciones de Despliegue Gratuito (Free Deployment Options)

Para desplegar tu aplicación Next.js + PostgreSQL de manera gratuita, la mejor estrategia es separar el **Frontend** (Next.js) de la **Base de Datos** (PostgreSQL).

Aquí te presento las mejores combinaciones gratuitas actuales:

## 🏆 Opción Recomendada: Vercel + Neon

Esta es la combinación más robusta, rápida y profesional para proyectos Next.js.

### 1. Base de Datos: Neon (o Supabase)
**Neon** ofrece un "Serverless Postgres" con un excelente plan gratuito.
- **Ventajas:** Rápido, no se "duerme" (cold start rápido), interfaz fácil.
- **Pasos:**
  1. Ve a [neon.tech](https://neon.tech) y crea una cuenta.
  2. Crea un nuevo proyecto.
  3. Copia la `Connection String` (URL de la base de datos). Se ve algo así: `postgres://usuario:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require`.
  4. Usa esta URL en tu proyecto de Vercel (ver abajo).

### 2. Frontend: Vercel
**Vercel** son los creadores de Next.js, por lo que su plataforma es el lugar ideal para alojarlo.
- **Pasos:**
  1. Sube tu código a **GitHub** (si no lo has hecho aún).
  2. Ve a [vercel.com](https://vercel.com) y regístrate con GitHub.
  3. Haz clic en **"Add New Project"** e importa tu repositorio.
  4. En la sección **"Environment Variables"**, agrega:
     - `DATABASE_URL`: Pega la URL que obtuviste de Neon.
     - `NEXTAUTH_SECRET`: Genera uno nuevo (puedes usar un string largo al azar).
     - `NEXTAUTH_URL`: En Vercel no suele ser necesario si usas `next-auth` v5, pero por seguridad puedes poner la URL que Vercel te asigne (ej. `https://tu-proyecto.vercel.app`).
  5. Haz clic en **Deploy**.

> **Nota:** Vercel detectará automáticamente que es un proyecto Next.js y ejecutará `npm run build`.

---

## 🥈 Opción Todo-en-uno: Render

**Render** permite hospedar tanto la web como la base de datos en el mismo lugar.
- **Ventajas:** Todo en un solo panel de control.
- **Desventajas:** El plan gratuito "duerme" los servicios tras 15 min de inactividad (tarda ~50 seg en despertar cuando alguien entra).
- **Pasos:**
  1. Crea una cuenta en [render.com](https://render.com).
  2. Crea una **PostgreSQL** database (Free plan). Copia la `Internal Database URL`.
  3. Crea un **Web Service**, conecta tu GitHub.
  4. Configura las variables de entorno (`DATABASE_URL`, etc.).
  5. Configura el Build Command: `npm install && npm run build`.
  6. Configura el Start Command: `npm start`.

---

## 💡 Pasos Finales Importantes

Independientemente de la opción que elijas, una vez que tengas la base de datos de producción conectada:

1. **Migraciones:** Deberás ejecutar las migraciones en esa base de datos remota. Si usas Vercel + Neon, puedes hacerlo desde tu computadora local cambiando temporalmente la `DATABASE_URL` en tu `.env` local por la de producción y ejecutando:
   ```bash
   npx prisma migrate deploy
   ```
   (O mejor aún, configurar un script de "Build" en Vercel que lo haga, pero hacerlo manual la primera vez es más seguro).

2. **Seed (Datos de prueba):** Si quieres los usuarios demo (Dr. Vargas, etc.) en producción, ejecuta localmente apuntando a la BD de producción:
   ```bash
   npx prisma db seed
   ```
