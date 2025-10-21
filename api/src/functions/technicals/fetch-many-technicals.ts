import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'

interface fetchManyTechnicalsFunctionReply {
  technicals: {
    name: string
    email: string
  }[]
}

export async function fetchManyTechnicalsFunction(): Promise<fetchManyTechnicalsFunctionReply> {
  const technicals = await prisma.users.findMany({
    select: {
      name: true,
      email: true,
    },
    where: {
      role: 'TECHNICAL',
    },
  })

  if (!technicals) {
    throw new ResourceNotFoundError()
  }

  return {
    technicals,
  }
}
