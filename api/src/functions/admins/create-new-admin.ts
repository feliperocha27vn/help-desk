import { hash } from 'bcrypt'
import { EmailAlreadyExistsError } from '../../errors/email-already-exists'
import { prisma } from '../../lib/prisma'

interface CreateNewAdminRequest {
  name: string
  email: string
  password: string
}

export async function createNewAdmin({
  name,
  email,
  password,
}: CreateNewAdminRequest) {
  const isEmailUnique = await prisma.admins.findUnique({
    where: { email },
  })

  if (isEmailUnique) {
    throw new EmailAlreadyExistsError()
  }

  const passwordHash = await hash(password, 6)

  await prisma.admins.create({
    data: {
      name,
      email,
      passwordHash,
    },
  })
}
