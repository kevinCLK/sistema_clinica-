# Sistema de Gestión de Clínica Médica (Moderno)

Sistema de gestión médica construido con tecnologías modernas: **Next.js 14+**, **TypeScript**, **Prisma ORM**, y **PostgreSQL**.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (React)
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Estilos:** Tailwind CSS
- **Componentes UI:** ShadCN UI

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio** (o acceder a la carpeta)
   ```bash
   cd sistema-clinica-moderno
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` basado en `.env.example`:
   ```env
   DATABASE_URL="postgresql://usuario:password@localhost:5432/clinica_db?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secret-aleatorio"
   ```

4. **Crear la base de datos**
   ```sql
   CREATE DATABASE clinica_db;
   ```

5. **Ejecutar migraciones de Prisma**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generar el cliente de Prisma**
   ```bash
   npx prisma generate
   ```

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

### Modo Producción
```bash
npm run build
npm start
```

## 📦 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia servidor de producción |
| `npm run test` | Ejecuta tests en modo watch |
| `npm run test:run` | Ejecuta tests una vez |
| `npm run test:coverage` | Ejecuta tests con reporte de cobertura |
| `npx prisma studio` | Abre interfaz visual de la base de datos |
| `npx prisma migrate dev` | Crea y aplica migraciones |
| `npx shadcn@latest add [component]` | Agrega componentes de ShadCN |

## 🧪 Testing

Este proyecto utiliza **Vitest** y **React Testing Library** para testing.

### Ejecutar Tests

```bash
# Modo watch (recomendado para desarrollo)
npm run test

# Ejecutar una vez (para CI/CD)
npm run test:run

# Con cobertura de código
npm run test:coverage

# UI interactiva
npm run test:ui
```

### Estructura de Tests

Los tests están organizados en la carpeta `tests/` siguiendo la estructura del proyecto:

```
tests/
├── lib/              # Tests de utilidades y validaciones
├── components/        # Tests de componentes React
└── app/              # Tests de server actions
```

Para más información, consulta [tests/README.md](./tests/README.md)

## 📊 Modelos de Datos

- **User**: Usuarios del sistema
- **Paciente**: Información de pacientes
- **Doctor**: Información de doctores
- **Consultorio**: Salas de consulta
- **Horario**: Disponibilidad de doctores
- **Cita**: Sistema de citas médicas

## 🎨 Agregar Componentes ShadCN

```bash
npx shadcn@latest add button
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add calendar
```


## 🔑 Credenciales de Prueba (Demo)

Para probar el sistema, asegúrate de haber ejecutado el seed (`npm run seed`).

**👨‍⚕️ Doctor (Acceso Admin/Doctor):**
- **Usuario:** `dr.vargas@clinica.com`
- **Contraseña:** `doctor123`

**👤 Paciente (Acceso Limitado):**
- **Usuario:** `paciente1@email.com`
- **Contraseña:** `doctor123`

## 📄 Licencia

MIT

