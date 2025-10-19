import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/lib/prisma'
import type { Users } from '@prisma/client'
import { compare } from 'bcrypt'

interface AuthenticateUserFunctionRequest {
  email: string
  password: string
}

interface AuthenticateUserFunctionReply {
  user: Users
}

export async function authenticateUserFunction({
  email,
  password,
}: AuthenticateUserFunctionRequest): Promise<AuthenticateUserFunctionReply> {
  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (!user) {
    throw new InvalidCredentialsError()
  }

  const doesPasswordMatch = await compare(password, user.passwordHash)

  if (!doesPasswordMatch) {
    throw new InvalidCredentialsError()
  }

  return { user }
}
