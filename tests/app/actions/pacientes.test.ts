import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPaciente, updatePaciente, deletePaciente } from '@/actions/pacientes'
import prisma from '@/lib/prisma'

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    paciente: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

// Mock de revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Pacientes Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createPaciente', () => {
    it('should create a paciente successfully', async () => {
      const pacienteData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        ci: '12345678',
        fechaNacimiento: '1990-01-01',
        genero: 'Masculino' as const,
        celular: '1234567890',
        correo: 'juan@example.com',
        direccion: 'Calle Principal 123',
        grupoSanguineo: 'O+' as const,
        contactoEmergencia: 'María Pérez - 987654321',
      }

      vi.mocked(prisma.paciente.create).mockResolvedValue({
        id: 1,
        ...pacienteData,
        numSeguro: null,
        alergias: 'NINGUNA',
        observaciones: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await createPaciente(pacienteData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Paciente creado exitosamente')
      expect(prisma.paciente.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nombre: 'JUAN',
          apellidos: 'PÉREZ',
          correo: 'juan@example.com',
        }),
      })
    })

    it('should return error for invalid data', async () => {
      const invalidData = {
        nombre: 'J', // Muy corto
        apellidos: 'Pérez',
      }

      const result = await createPaciente(invalidData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Error al crear paciente')
    })

    it('should handle database errors', async () => {
      const pacienteData = {
        nombre: 'Juan',
        apellidos: 'Pérez',
        ci: '12345678',
        fechaNacimiento: '1990-01-01',
        genero: 'Masculino' as const,
        celular: '1234567890',
        correo: 'juan@example.com',
        direccion: 'Calle Principal 123',
        grupoSanguineo: 'O+' as const,
        contactoEmergencia: 'María Pérez - 987654321',
      }

      vi.mocked(prisma.paciente.create).mockRejectedValue(
        new Error('Database error')
      )

      const result = await createPaciente(pacienteData)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Error al crear paciente')
    })
  })

  describe('updatePaciente', () => {
    it('should update a paciente successfully', async () => {
      const pacienteData = {
        nombre: 'Juan',
        apellidos: 'Pérez García',
        ci: '12345678',
        fechaNacimiento: '1990-01-01',
        genero: 'Masculino' as const,
        celular: '1234567890',
        correo: 'juan@example.com',
        direccion: 'Calle Principal 123',
        grupoSanguineo: 'O+' as const,
        contactoEmergencia: 'María Pérez - 987654321',
      }

      vi.mocked(prisma.paciente.update).mockResolvedValue({
        id: 1,
        ...pacienteData,
        numSeguro: null,
        alergias: 'NINGUNA',
        observaciones: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await updatePaciente(1, pacienteData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Paciente actualizado exitosamente')
      expect(prisma.paciente.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.any(Object),
      })
    })
  })

  describe('deletePaciente', () => {
    it('should delete a paciente successfully', async () => {
      vi.mocked(prisma.paciente.delete).mockResolvedValue({
        id: 1,
        nombre: 'Juan',
        apellidos: 'Pérez',
        ci: '12345678',
        fechaNacimiento: new Date('1990-01-01'),
        genero: 'Masculino',
        celular: '1234567890',
        correo: 'juan@example.com',
        direccion: 'Calle Principal 123',
        grupoSanguineo: 'O+',
        contactoEmergencia: 'María Pérez',
        numSeguro: null,
        alergias: 'NINGUNA',
        observaciones: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await deletePaciente(1)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Paciente eliminado exitosamente')
      expect(prisma.paciente.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it('should handle deletion errors', async () => {
      vi.mocked(prisma.paciente.delete).mockRejectedValue(
        new Error('Database error')
      )

      const result = await deletePaciente(1)

      expect(result.success).toBe(false)
      expect(result.message).toBe('Error al eliminar paciente')
    })
  })
})
