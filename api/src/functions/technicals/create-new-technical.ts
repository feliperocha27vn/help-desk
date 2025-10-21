import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { prisma } from '@/lib/prisma'
import { buildWorkWindows, generateSlotsFromWindows } from '@/utils/time'
import { hash } from 'bcrypt'

interface createNewTechnicalFunctionRequest {
  name: string
  email: string
  password: string
}

export async function createNewTechnicalFunction({
  email,
  name,
  password,
}: createNewTechnicalFunctionRequest) {
  const isEmailAlreadyUsed = await prisma.users.findUnique({
    where: {
      email,
    },
  })

  if (isEmailAlreadyUsed) {
    throw new EmailAlreadyExistsError()
  }

  const passwordHash = await hash(password, 6)

  // default template: 08:00-18:00 with break 12:00-14:00 and 60-min slots
  const template = {
    start: '08:00',
    end: '18:00',
    breakStart: '12:00',
    breakEnd: '14:00',
    slotDuration: 60,
  }

  const windows = buildWorkWindows(
    template.start,
    template.end,
    template.breakStart,
    template.breakEnd
  )
  const slots = generateSlotsFromWindows(windows, template.slotDuration)

  const result = await prisma.$transaction(async tx => {
    const technical = await tx.users.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'TECHNICAL',
      },
    })

    const data = slots.map(hour => ({ usersId: technical.id, hour }))

    await tx.schedulesTechnicals.createMany({
      data,
      skipDuplicates: true,
    })

    return technical
  })

  return result
}
