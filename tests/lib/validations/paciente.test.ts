import { describe, it, expect } from 'vitest'
import { pacienteSchema } from '@/lib/validations/paciente'

describe('pacienteSchema validation', () => {
  const validPaciente = {
    nombre: 'Juan',
    apellidos: 'Pérez',
    ci: '12345678',
    numSeguro: '1234567890',
    fechaNacimiento: '1990-01-01',
    genero: 'Masculino' as const,
    celular: '1234567890',
    correo: 'juan@example.com',
    direccion: 'Calle Principal 123',
    grupoSanguineo: 'O+' as const,
    alergias: 'Ninguna',
    contactoEmergencia: 'María Pérez - 987654321',
    observaciones: 'Paciente regular',
  }

  it('should validate a correct paciente', () => {
    const result = pacienteSchema.safeParse(validPaciente)
    expect(result.success).toBe(true)
  })

  it('should reject paciente with short nombre', () => {
    const invalid = { ...validPaciente, nombre: 'J' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('al menos 2 caracteres')
    }
  })

  it('should reject paciente with invalid email', () => {
    const invalid = { ...validPaciente, correo: 'invalid-email' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Email inválido')
    }
  })

  it('should reject paciente with invalid genero', () => {
    const invalid = { ...validPaciente, genero: 'Invalid' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should reject paciente with invalid grupoSanguineo', () => {
    const invalid = { ...validPaciente, grupoSanguineo: 'X+' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should accept paciente without optional fields', () => {
    const minimal = {
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
    const result = pacienteSchema.safeParse(minimal)
    expect(result.success).toBe(true)
  })

  it('should accept empty string for optional fields', () => {
    const withEmpty = {
      ...validPaciente,
      numSeguro: '',
      alergias: '',
      observaciones: '',
    }
    const result = pacienteSchema.safeParse(withEmpty)
    expect(result.success).toBe(true)
  })

  it('should reject paciente with short celular', () => {
    const invalid = { ...validPaciente, celular: '123' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('al menos 7 dígitos')
    }
  })

  it('should reject paciente with short direccion', () => {
    const invalid = { ...validPaciente, direccion: 'Calle' }
    const result = pacienteSchema.safeParse(invalid)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('al menos 5 caracteres')
    }
  })
})
