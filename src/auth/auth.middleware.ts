import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { verifyToken } from './auth.service.js'
import { UserRole } from '../user/user.entity.js'

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        email: string
        role: UserRole
      }
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.Unauthorized(res, 'Token de autenticación requerido')
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    // Validar que decoded.userId existe
    if (!decoded.userId) {
      return HttpResponse.Unauthorized(res, 'Token inválido')
    }

    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error: any) {
    return HttpResponse.Unauthorized(res, error.message)
  }
}

export function authorize(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return HttpResponse.Unauthorized(res, 'Usuario no autenticado')
    }

    if (!roles.includes(req.user.role)) {
      return HttpResponse.Forbidden(res, 'No tienes permisos para realizar esta acción')
    }

    next()
  }
}

// Middlewares específicos por rol
export const requireAdmin = authorize([UserRole.ADMIN])
export const requireSeller = authorize([UserRole.SELLER, UserRole.ADMIN])
export const requireCustomer = authorize([UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN])