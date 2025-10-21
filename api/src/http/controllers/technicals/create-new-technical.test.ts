import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticationUser } from '@/utils/tests/auth-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create a new technical', () => {
  it('should be able create a new technical', async () => {
    const { token } = await createAndAuthenticationUser(app, 'ADMIN')

    const reply = await request(app.server)
      .post('/technicals')
      .send({
        name: 'Technical Test',
        email: 'technicalemail@test.com',
        password: '123456',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toEqual(201)

    const technical = await prisma.users.findFirstOrThrow({
      where: {
        role: 'TECHNICAL',
      },
    })

    const technicalSchedule = await prisma.schedulesTechnicals.findMany({
      where: {
        usersId: technical?.id,
      },
    })

    expect(technical.email).toEqual('technicalemail@test.com')
    expect(technicalSchedule).toHaveLength(8)
  })
})
