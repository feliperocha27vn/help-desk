import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { prisma } from '@/lib/prisma'

interface updateTechnicalFunctionRequest {
  technicalId: string
  name?: string
  email?: string
}

export async function updateTechnicalFunction({
  technicalId,
  name,
  email,
}: updateTechnicalFunctionRequest) {
  const technical = await prisma.users.findUnique({
    where: {
      id: technicalId,
    },
  })

  if (!technical) {
    throw new ResourceNotFoundError()
  }

  await prisma.users.update({
    where: {
      id: technicalId,
    },
    data: {
      name,
      email,
    },
  })
}
