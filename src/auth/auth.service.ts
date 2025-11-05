import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { config } from '../config.js'
import { getUserByEmail } from '../user/user.service.js'
import { UserRole } from '../user/user.entity.js'

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    role: UserRole
    businessName?: string
  }
  token: string
}

export async function login(loginData: LoginData): Promise<AuthResponse> {
  const { email, password } = loginData

  // Buscar usuario por email
  const user = await getUserByEmail(email)

  // Validar que el usuario tiene ID
  if (!user.id) {
    throw new Error('Error: usuario sin ID válido')
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas')
  }

  // Generar token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    config.secrets.key,
    { expiresIn: '24h' }
  )

  // Retornar usuario (sin password) y token
  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      businessName: user.businessName
    },
    token
  }
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, config.secrets.key)
  } catch (error) {
    throw new Error('Token inválido o expirado')
  }
}