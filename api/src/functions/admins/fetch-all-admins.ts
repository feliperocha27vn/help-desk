import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'

interface FetchAllAdminsFunctionReply {
  admins: {
    id: string
    name: string
    email: string
  }[]
}

export async function fetchAllAdminsFunction(): Promise<FetchAllAdminsFunctionReply> {
  const admins = await prisma.users.findMany({
    where: { role: 'ADMIN' },
  })

  if (!admins) {
    throw new ResourceNotFoundError()
  }

  return { admins }
}
