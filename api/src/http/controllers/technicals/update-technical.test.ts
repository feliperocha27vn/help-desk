import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticationUser } from '@/utils/tests/auth-user'
import { hash } from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Update technical', () => {
  it('should be able to update a technical', async () => {
    const { token } = await createAndAuthenticationUser(app, 'ADMIN')

    const technical = await prisma.users.create({
      data: {
        name: 'Tech One',
        email: 'techone@example.com',
        passwordHash: await hash('hashedpassword', 10),
        role: 'TECHNICAL',
      },
    })

    const reply = await request(app.server)
      .patch(`/technicals/${technical.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Tech One Updated',
        email: 'techoneupdated@example.com',
      })

    expect(reply.statusCode).toEqual(204)

    const updatedTechnical = await prisma.users.findUnique({
      where: {
        id: technical.id,
      },
    })

    expect(updatedTechnical).toMatchObject({
      name: 'Tech One Updated',
      email: 'techoneupdated@example.com',
    })
  })
})
