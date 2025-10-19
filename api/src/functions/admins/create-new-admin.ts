import { hash } from 'bcrypt'
import { EmailAlreadyExistsError } from '../../errors/email-already-exists-error'
import { prisma } from '../../lib/prisma'

interface CreateNewAdminFunctionRequest {
  name: string
  email: string
  password: string
}

export async function createNewAdminFunction({
  name,
  email,
  password,
}: CreateNewAdminFunctionRequest) {
  const isEmailUnique = await prisma.users.findUnique({
    where: { email },
  })

  if (isEmailUnique) {
    throw new EmailAlreadyExistsError()
  }

  const passwordHash = await hash(password, 6)

  await prisma.users.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'ADMIN',
    },
  })
}
