import { NextFunction, Request, Response } from 'express'
import jwtConfig from '@config/auth'
import { Secret, verify } from 'jsonwebtoken'

type JetPayloadProps = {
  sub: string
}
export const isAuthenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization
  if (!authHeader) {
    return response.status(401).json({
      error: true,
      code: 'token.invalid',
      message: 'Access token not present',
    })
  }
  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    return response.status(401).json({
      error: true,
      code: 'token.invalid',
      message: 'Access token not present',
    })
  }
  try {
    const decodedToken = verify(token, jwtConfig.jwt.secret as Secret)
    const { sub } = decodedToken as JetPayloadProps
    request.user = { id: sub }
    next()
  } catch {
    return response.status(401).json({
      error: true,
      code: 'token.expired',
      message: 'Access token not present',
    })
  }
}
