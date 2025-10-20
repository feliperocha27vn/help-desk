import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

interface createNewTechnicalFunctionRequest {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'TECHNICAL' | 'CUSTOMER'
}

export async function createNewTechnicalFunction({
  email,
  name,
  password,
  role,
}: createNewTechnicalFunctionRequest) {
  if (role !== 'ADMIN') {
    throw new InvalidCredentialsError()
  }

  const passwordHash = await hash(password, 6)

  const technical = await prisma.users.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'TECHNICAL',
    },
  })
}
