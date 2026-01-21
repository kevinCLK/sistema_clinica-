# Guía de Despliegue (Deployment Guide)

Este documento detalla los pasos para preparar y desplegar el Sistema de Gestión de Clínica Médica en un entorno de producción.

## 1. Requisitos Previos
- **Node.js**: Versión 18 o superior (se recomienda v20+).
- **PostgreSQL**: Base de datos relacional.
- **NPM**: Gestor de paquetes.

## 2. Configuración de Variables de Entorno
En el servidor de producción, debes configurar las siguientes variables de entorno. Puedes usar un archivo `.env` o configurarlas en el panel de control de tu proveedor de hosting (Vercel, Railway, etc.).

```env
# URL de conexión a la base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db?schema=public"

# URL base de la aplicación (cambiar por el dominio real en producción)
NEXTAUTH_URL="https://tu-dominio.com"

# Secreto para la encriptación de sesiones (generar uno fuerte)
# Puedes generar uno con: openssl rand -base64 32
NEXTAUTH_SECRET="tu_secreto_super_seguro"
```

## 3. Instalación de Dependencias
Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install
```

> **Nota**: Se ha ajustado la versión de `zod` a la 3.x para asegurar compatibilidad con `react-hook-form`.

## 4. Configuración de Base de Datos
Antes de iniciar la aplicación, debes aplicar las migraciones a la base de datos de producción:

```bash
npx prisma migrate deploy
```

Opcional: Si deseas poblar la base de datos con datos iniciales (solo primera vez):
```bash
npm run seed
```

## 5. Construcción (Build)
Genera la versión optimizada para producción:

```bash
npm run build
```

> **Nota**: Se han excluido los tests del proceso de build (`tsconfig.json`) para evitar fallos por archivos de prueba en producción.

## 6. Ejecución
Inicia el servidor de producción:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado por tu host).

## Solución de Problemas Comunes

### Error de Tipos con Zod
Si encuentras errores relacionados con `Resolver` o `zod`, asegúrate de que `zod` esté en la versión 3.x (ej. `3.24.1`). La versión 4.x aún puede tener incompatibilidades con algunas librerías.

### Errores de Conexión a Base de Datos
Verifica que la `DATABASE_URL` sea correcta y que el servidor tenga acceso a la base de datos (firewalls, whitelist de IPs).
