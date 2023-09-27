/* eslint-disable prettier/prettier */
import { inject, injectable } from 'tsyringe'
import { compare } from 'bcryptjs'
import jwtConfig from '@config/auth'
import { AppError } from '@shared/errors/AppError'
import { User } from '@user/entities/User'
import { IUsersRepository } from '@user/repositories/IUsersRepository'
import { sign } from 'jsonwebtoken'
import { IRefreshTokenRepository } from '@user/repositories/IRefreshTokenRepository'

export type CreateULoginDTO = {
  email: string
  password: string
}

type IResponse = {
  user: User
  accessToken: string
  refreshToken: string
}

@injectable()
export class CreateLoginUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('RefreshTokenRepository') private refreshTokenRepository: IRefreshTokenRepository
  ) { }

  async execute({ email, password }: CreateULoginDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401)
    }
    const passwordConfirmed = await compare(password, user.password)
    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination', 401)
    }

    const accessToken = sign({}, jwtConfig.jwt.secret, {
      subject: user.id,
      expiresIn: jwtConfig.jwt.expiresIn,
    })

    const expires = new Date(Date.now() + jwtConfig.refreshToken.duration)

    const refreshToken = sign({}, jwtConfig.refreshToken.secret, {
      subject: user.id,
      expiresIn: jwtConfig.refreshToken.expiresIn,
    })

    await this.refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      valid: true,
      expires,
    })
    return {
      user,
      accessToken,
      refreshToken
    }
  }
}
