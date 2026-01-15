# Guía de Testing - Sistema de Gestión de Clínica Médica

## 📋 Configuración

Este proyecto utiliza **Vitest** como framework de testing junto con **React Testing Library** para componentes React.

## 🚀 Comandos Disponibles

```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests una vez (para CI/CD)
npm run test:run

# Ejecutar tests con cobertura
npm run test:coverage
```

## 📁 Estructura de Tests

```
tests/
├── setup.ts                    # Configuración global de tests
├── lib/
│   ├── utils.test.ts          # Tests de utilidades
│   └── validations/
│       └── paciente.test.ts   # Tests de validaciones
├── components/
│   └── ui/
│       └── button.test.tsx    # Tests de componentes UI
└── app/
    └── actions/
        └── pacientes.test.ts  # Tests de server actions
```

## ✍️ Escribir Tests

### Tests de Utilidades

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn function', () => {
  it('should merge classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
})
```

### Tests de Validaciones (Zod)

```typescript
import { describe, it, expect } from 'vitest'
import { pacienteSchema } from '@/lib/validations/paciente'

describe('pacienteSchema', () => {
  it('should validate correct data', () => {
    const result = pacienteSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
```

### Tests de Componentes React

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render button', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### Tests de Server Actions

```typescript
import { describe, it, expect, vi } from 'vitest'
import { createPaciente } from '@/app/actions/pacientes'
import prisma from '@/lib/prisma'

vi.mock('@/lib/prisma')

describe('createPaciente', () => {
  it('should create paciente', async () => {
    vi.mocked(prisma.paciente.create).mockResolvedValue(mockData)
    const result = await createPaciente(validData)
    expect(result.success).toBe(true)
  })
})
```

## 🎯 Mejores Prácticas

1. **Nombres descriptivos**: Usa nombres claros para tus tests
2. **Un test, una cosa**: Cada test debe verificar una sola funcionalidad
3. **Arrange-Act-Assert**: Organiza tus tests en estas tres secciones
4. **Mocks apropiados**: Usa mocks para dependencias externas (Prisma, Next.js)
5. **Cobertura**: Apunta a al menos 70% de cobertura de código

## 📊 Cobertura de Código

Para ver el reporte de cobertura:

```bash
npm run test:coverage
```

Esto generará un reporte HTML en `coverage/` que puedes abrir en tu navegador.

## 🔧 Configuración

La configuración de Vitest está en `vitest.config.ts`. Los mocks globales están en `tests/setup.ts`.

## 📝 Ejemplos de Tests Incluidos

- ✅ Tests de utilidades (`lib/utils.test.ts`)
- ✅ Tests de validaciones (`lib/validations/paciente.test.ts`)
- ✅ Tests de componentes UI (`components/ui/button.test.tsx`)
- ✅ Tests de server actions (`app/actions/pacientes.test.ts`)

## 🚨 Troubleshooting

### Error: "Cannot find module '@/lib/utils'"
- Verifica que `vitest.config.ts` tenga el alias `@` configurado correctamente

### Error: "window is not defined"
- Asegúrate de que `vitest.config.ts` tenga `environment: 'jsdom'`

### Tests de Prisma fallan
- Verifica que los mocks en `tests/setup.ts` estén correctamente configurados
