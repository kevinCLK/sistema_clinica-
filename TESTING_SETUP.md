# 🧪 Configuración de Testing - Guía de Instalación

## 📋 Instalación de Dependencias

Para comenzar a usar el sistema de testing, primero necesitas instalar las dependencias:

```bash
npm install --save-dev \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

O simplemente ejecuta:

```bash
npm install
```

## ✅ Verificar Instalación

Después de instalar, verifica que todo esté configurado correctamente:

```bash
npm run test:run
```

Deberías ver los tests ejecutándose y pasando.

## 🚀 Primeros Pasos

### 1. Ejecutar Tests Existentes

```bash
# Modo watch (se actualiza automáticamente)
npm run test

# Ejecutar una vez
npm run test:run
```

### 2. Ver Cobertura de Código

```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/index.html` que puedes abrir en tu navegador.

### 3. UI Interactiva

```bash
npm run test:ui
```

Abre una interfaz gráfica para ejecutar y depurar tests.

## 📝 Escribir tu Primer Test

### Ejemplo: Test de una Función Simple

Crea un archivo `tests/lib/example.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('Ejemplo de test', () => {
  it('debería sumar correctamente', () => {
    expect(1 + 1).toBe(2)
  })
})
```

### Ejemplo: Test de un Componente

Crea un archivo `tests/components/example.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('debería renderizar el texto', () => {
    render(<Button>Hola</Button>)
    expect(screen.getByText('Hola')).toBeInTheDocument()
  })
})
```

## 📚 Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Guía de Testing en Next.js](https://nextjs.org/docs/testing)

## 🔧 Solución de Problemas

### Error: "Cannot find module"
- Asegúrate de que todas las dependencias estén instaladas
- Verifica que `vitest.config.ts` tenga los aliases correctos

### Tests no se ejecutan
- Verifica que los archivos terminen en `.test.ts` o `.spec.ts`
- Asegúrate de que `vitest.config.ts` esté en la raíz del proyecto

### Errores de TypeScript
- Verifica que `tsconfig.json` incluya los archivos de test
- Asegúrate de tener los tipos correctos instalados
