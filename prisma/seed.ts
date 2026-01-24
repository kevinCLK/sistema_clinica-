import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...')

    // Limpiar datos existentes
    console.log('🗑️  Limpiando datos existentes...')
    await prisma.cita.deleteMany()
    await prisma.horario.deleteMany()
    await prisma.doctor.deleteMany()
    await prisma.consultorio.deleteMany()
    await prisma.paciente.deleteMany()
    await prisma.user.deleteMany()

    // Crear usuarios/pacientes
    console.log('👥 Creando pacientes...')
    const pacientes = await Promise.all([
        prisma.paciente.create({
            data: {
                nombre: 'JUAN',
                apellidos: 'PÉREZ GONZÁLEZ',
                ci: '12345678',
                numSeguro: 'NS-001',
                fechaNacimiento: '1990-05-15',
                genero: 'Masculino',
                celular: '70123456',
                correo: 'juan.perez@email.com',
                direccion: 'AV. PRINCIPAL #123, ZONA CENTRAL',
                grupoSanguineo: 'O+',
                alergias: 'NINGUNA',
                contactoEmergencia: 'MARÍA PÉREZ - 75123456',
                observaciones: 'PACIENTE REGULAR',
            },
        }),
        prisma.paciente.create({
            data: {
                nombre: 'MARÍA',
                apellidos: 'GONZÁLEZ LÓPEZ',
                ci: '87654321',
                numSeguro: 'NS-002',
                fechaNacimiento: '1985-08-20',
                genero: 'Femenino',
                celular: '75234567',
                correo: 'maria.gonzalez@email.com',
                direccion: 'CALLE 10 #456, ZONA SUR',
                grupoSanguineo: 'A+',
                alergias: 'PENICILINA',
                contactoEmergencia: 'CARLOS GONZÁLEZ - 70234567',
                observaciones: 'HIPERTENSIÓN CONTROLADA',
            },
        }),
        prisma.paciente.create({
            data: {
                nombre: 'CARLOS',
                apellidos: 'RODRÍGUEZ SÁNCHEZ',
                ci: '45678912',
                numSeguro: 'NS-003',
                fechaNacimiento: '1995-03-10',
                genero: 'Masculino',
                celular: '71345678',
                correo: 'carlos.rodriguez@email.com',
                direccion: 'AV. SECUNDARIA #789, ZONA NORTE',
                grupoSanguineo: 'B+',
                alergias: 'NINGUNA',
                contactoEmergencia: 'ANA RODRÍGUEZ - 76345678',
                observaciones: '',
            },
        }),
        prisma.paciente.create({
            data: {
                nombre: 'ANA',
                apellidos: 'MARTÍNEZ FLORES',
                ci: '78912345',
                numSeguro: 'NS-004',
                fechaNacimiento: '1988-11-25',
                genero: 'Femenino',
                celular: '72456789',
                correo: 'ana.martinez@email.com',
                direccion: 'CALLE 5 #321, ZONA ESTE',
                grupoSanguineo: 'AB+',
                alergias: 'POLEN, ASPIRINA',
                contactoEmergencia: 'LUIS MARTÍNEZ - 77456789',
                observaciones: 'ASMA LEVE',
            },
        }),
        prisma.paciente.create({
            data: {
                nombre: 'LUIS',
                apellidos: 'FERNÁNDEZ TORRES',
                ci: '32165498',
                numSeguro: 'NS-005',
                fechaNacimiento: '1992-07-18',
                genero: 'Masculino',
                celular: '73567890',
                correo: 'luis.fernandez@email.com',
                direccion: 'AV. TERCERA #654, ZONA OESTE',
                grupoSanguineo: 'O-',
                alergias: 'NINGUNA',
                contactoEmergencia: 'SOFÍA FERNÁNDEZ - 78567890',
                observaciones: 'DIABÉTICO TIPO 2',
            },
        }),
    ])

    // Crear usuario Administrador
    console.log('👤 Creando administrador...');
    const hashedAdminPassword = await hash('admin123', 10);
    await prisma.user.create({
        data: {
            name: 'Administrador del Sistema',
            email: 'admin@clinica.com',
            password: hashedAdminPassword,
            role: 'ADMIN',
        },
    });

    // Crear usuarios para los doctores
    console.log('👨‍⚕️ Creando doctores...')
    const hashedDoctorPassword = await hash('doctor123', 10)

    const userDoctor1 = await prisma.user.create({
        data: {
            name: 'Dr. Roberto Vargas Méndez',
            email: 'dr.vargas@clinica.com',
            password: hashedDoctorPassword,
            role: 'DOCTOR',
        },
    })

    const userDoctor2 = await prisma.user.create({
        data: {
            name: 'Dra. Patricia Morales Cruz',
            email: 'dra.morales@clinica.com',
            password: hashedDoctorPassword,
            role: 'DOCTOR',
        },
    })

    const userDoctor3 = await prisma.user.create({
        data: {
            name: 'Dr. Miguel Ángel Ruiz',
            email: 'dr.ruiz@clinica.com',
            password: hashedDoctorPassword,
            role: 'DOCTOR',
        },
    })

    const doctores = await Promise.all([
        prisma.doctor.create({
            data: {
                nombres: 'ROBERTO',
                apellidos: 'VARGAS MÉNDEZ',
                telefono: '70111222',
                licenciaMedica: 'LM-1001',
                especialidad: 'CARDIOLOGÍA',
                userId: userDoctor1.id,
            },
        }),
        prisma.doctor.create({
            data: {
                nombres: 'PATRICIA',
                apellidos: 'MORALES CRUZ',
                telefono: '70333444',
                licenciaMedica: 'LM-1002',
                especialidad: 'PEDIATRÍA',
                userId: userDoctor2.id,
            },
        }),
        prisma.doctor.create({
            data: {
                nombres: 'MIGUEL ÁNGEL',
                apellidos: 'RUIZ CASTRO',
                telefono: '70555666',
                licenciaMedica: 'LM-1003',
                especialidad: 'MEDICINA GENERAL',
                userId: userDoctor3.id,
            },
        }),
    ])

    // Crear consultorios
    console.log('🏥 Creando consultorios...')
    const consultorios = await Promise.all([
        prisma.consultorio.create({
            data: {
                nombre: 'CONSULTORIO 1',
                ubicacion: 'PISO 1, ALA NORTE',
                capacidad: '4 PERSONAS',
                telefono: '4001001',
                especialidad: 'CARDIOLOGÍA',
                estado: 'Disponible',
            },
        }),
        prisma.consultorio.create({
            data: {
                nombre: 'CONSULTORIO 2',
                ubicacion: 'PISO 1, ALA SUR',
                capacidad: '3 PERSONAS',
                telefono: '4001002',
                especialidad: 'PEDIATRÍA',
                estado: 'Disponible',
            },
        }),
        prisma.consultorio.create({
            data: {
                nombre: 'CONSULTORIO 3',
                ubicacion: 'PISO 2, ALA NORTE',
                capacidad: '5 PERSONAS',
                telefono: '4001003',
                especialidad: 'MEDICINA GENERAL',
                estado: 'Disponible',
            },
        }),
        prisma.consultorio.create({
            data: {
                nombre: 'CONSULTORIO 4',
                ubicacion: 'PISO 2, ALA SUR',
                capacidad: '4 PERSONAS',
                telefono: null,
                especialidad: 'MEDICINA GENERAL',
                estado: 'Mantenimiento',
            },
        }),
    ])

    // Crear usuarios-pacientes para las citas
    console.log('👤 Creando usuarios para pacientes...')
    const userPacientes = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Juan Pérez González',
                email: 'paciente1@email.com',
                password: hashedDoctorPassword,
                role: 'PATIENT',
            },
        }),
        prisma.user.create({
            data: {
                name: 'María González López',
                email: 'paciente2@email.com',
                password: hashedDoctorPassword,
                role: 'PATIENT',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Carlos Rodríguez Sánchez',
                email: 'paciente3@email.com',
                password: hashedDoctorPassword,
                role: 'PATIENT',
            },
        }),
    ])

    // Crear citas
    console.log('📅 Creando citas...')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    await Promise.all([
        // Cita de hoy - mañana
        prisma.cita.create({
            data: {
                titulo: 'CONSULTA CARDIOLÓGICA',
                inicio: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
                final: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
                color: '#ef4444',
                userId: userPacientes[0].id,
                doctorId: doctores[0].id,
                consultorioId: consultorios[0].id,
            },
        }),
        // Cita de hoy - tarde
        prisma.cita.create({
            data: {
                titulo: 'CONTROL PEDIÁTRICO',
                inicio: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
                final: new Date(today.setHours(15, 0, 0, 0)).toISOString(),
                color: '#3b82f6',
                userId: userPacientes[1].id,
                doctorId: doctores[1].id,
                consultorioId: consultorios[1].id,
            },
        }),
        // Cita mañana
        prisma.cita.create({
            data: {
                titulo: 'REVISIÓN GENERAL',
                inicio: new Date(tomorrow.setHours(10, 30, 0, 0)).toISOString(),
                final: new Date(tomorrow.setHours(11, 30, 0, 0)).toISOString(),
                color: '#10b981',
                userId: userPacientes[2].id,
                doctorId: doctores[2].id,
                consultorioId: consultorios[2].id,
            },
        }),
        // Cita próxima semana
        prisma.cita.create({
            data: {
                titulo: 'SEGUIMIENTO CARDIOLÓGICO',
                inicio: new Date(nextWeek.setHours(11, 0, 0, 0)).toISOString(),
                final: new Date(nextWeek.setHours(12, 0, 0, 0)).toISOString(),
                color: '#f59e0b',
                userId: userPacientes[0].id,
                doctorId: doctores[0].id,
                consultorioId: consultorios[0].id,
            },
        }),
        // Otra cita próxima semana
        prisma.cita.create({
            data: {
                titulo: 'CONSULTA PEDIÁTRICA',
                inicio: new Date(nextWeek.setHours(15, 0, 0, 0)).toISOString(),
                final: new Date(nextWeek.setHours(16, 0, 0, 0)).toISOString(),
                color: '#8b5cf6',
                userId: userPacientes[1].id,
                doctorId: doctores[1].id,
                consultorioId: consultorios[1].id,
            },
        }),
    ])

    console.log('✅ Seed completado exitosamente!')
    console.log('\n📊 Resumen:')
    console.log(`   - ${pacientes.length} pacientes creados`)
    console.log(`   - ${doctores.length} doctores creados`)
    console.log(`   - ${consultorios.length} consultorios creados`)
    console.log(`   - ${userPacientes.length} usuarios-pacientes creados`)
    console.log(`   - 5 citas creadas`)
    console.log('\n🔑 Credenciales de acceso:')
    console.log('   Doctores: dr.vargas@clinica.com / doctor123')
    console.log('   Pacientes: paciente1@email.com / doctor123')
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
