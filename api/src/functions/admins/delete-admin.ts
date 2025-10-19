import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { prisma } from '@/lib/prisma'

interface DeleteAdminFunctionRequest {
  adminId: string
  role: 'ADMIN' | 'TECHNICAL' | 'CUSTOMER'
}

export async function deleteAdminFunction({
  adminId,
  role,
}: DeleteAdminFunctionRequest) {
  if (role !== 'ADMIN') {
    throw new InvalidCredentialsError()
  }

  await prisma.users.delete({
    where: { id: adminId },
  })
}
