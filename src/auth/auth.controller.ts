import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { login, LoginData } from './auth.service.js'

export async function loginHandler(req: Request, res: Response) {
  try {
    const loginData: LoginData = req.body

    if (!loginData.email || !loginData.password) {
      return HttpResponse.BadRequest(res, 'Email y contraseña son requeridos')
    }

    const authResponse = await login(loginData)
    return HttpResponse.Ok(res, 'Login exitoso', authResponse)
  } catch (err: any) {
    if (err.message === 'Credenciales inválidas') {
      return HttpResponse.Unauthorized(res, err.message)
    }
    if (err.message.includes('no fue encontrado')) {
      return HttpResponse.NotFound(res, 'Usuario no encontrado')
    }
    return HttpResponse.Error(res, 'Error en el login')
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    // El usuario ya está autenticado por el middleware
    const userService = await import('../user/user.service.js')
    const user = await userService.getUserById(req.user!.userId)
    
    // Retornar sin password
    const { password, ...userWithoutPassword } = user
    return HttpResponse.Ok(res, 'Perfil obtenido correctamente', userWithoutPassword)
  } catch (err: any) {
    return HttpResponse.Error(res, 'Error al obtener el perfil')
  }
}