import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/lib/prisma'

interface UpdateAdminFunctionRequest {
  adminId: string
  role: 'ADMIN' | 'TECHNICAL' | 'CUSTOMER'
  name?: string
  email?: string
}

export async function updateAdminFunction({
  adminId,
  role,
  name,
  email,
}: UpdateAdminFunctionRequest) {
  if (role !== 'ADMIN') {
    throw new InvalidCredentialsError()
  }

  await prisma.users.update({
    where: { id: adminId },
    data: {
      name,
      email,
    },
  })
}
