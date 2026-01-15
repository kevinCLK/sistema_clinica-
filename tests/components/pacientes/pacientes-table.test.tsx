import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PacientesTable } from '@/components/pacientes/pacientes-table'

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de actions
vi.mock('@/app/actions/pacientes', () => ({
  deletePaciente: vi.fn(),
}))

const mockPacientes = [
  {
    id: 1,
    nombre: 'Juan',
    apellidos: 'Pérez',
    ci: '12345678',
    fechaNacimiento: '1990-01-01',
    genero: 'Masculino',
    celular: '1234567890',
    correo: 'juan@example.com',
    grupoSanguineo: 'O+',
  },
  {
    id: 2,
    nombre: 'María',
    apellidos: 'García',
    ci: '87654321',
    fechaNacimiento: '1995-05-15',
    genero: 'Femenino',
    celular: '0987654321',
    correo: 'maria@example.com',
    grupoSanguineo: 'A+',
  },
]

describe('PacientesTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render pacientes table', () => {
    render(<PacientesTable pacientes={mockPacientes} />)
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.getByText('María García')).toBeInTheDocument()
  })

  it('should display search input', () => {
    render(<PacientesTable pacientes={mockPacientes} />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nombre/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should filter pacientes by search term', async () => {
    const user = userEvent.setup()
    render(<PacientesTable pacientes={mockPacientes} />)
    
    const searchInput = screen.getByPlaceholderText(/buscar por nombre/i)
    await user.type(searchInput, 'Juan')
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
    expect(screen.queryByText('María García')).not.toBeInTheDocument()
  })

  it('should display "Nuevo Paciente" button', () => {
    render(<PacientesTable pacientes={mockPacientes} />)
    
    expect(screen.getByRole('button', { name: /nuevo paciente/i })).toBeInTheDocument()
  })

  it('should display export buttons', () => {
    render(<PacientesTable pacientes={mockPacientes} />)
    
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument()
  })

  it('should show empty state when no pacientes', () => {
    render(<PacientesTable pacientes={[]} />)
    
    expect(screen.getByText(/no hay pacientes registrados/i)).toBeInTheDocument()
  })

  it('should show pagination when there are many pacientes', () => {
    const manyPacientes = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      nombre: `Paciente ${i + 1}`,
      apellidos: 'Test',
      ci: `1234567${i}`,
      fechaNacimiento: '1990-01-01',
      genero: 'Masculino',
      celular: '1234567890',
      correo: `paciente${i}@example.com`,
      grupoSanguineo: 'O+',
    }))

    render(<PacientesTable pacientes={manyPacientes} />)
    
    // Debería mostrar paginación
    expect(screen.getByText(/página/i)).toBeInTheDocument()
  })
})
