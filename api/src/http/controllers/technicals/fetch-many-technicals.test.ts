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

describe('Fetch many technicals', () => {
  it('should be able to fetch many technicals', async () => {
    const { token } = await createAndAuthenticationUser(app, 'ADMIN')

    await prisma.users.createMany({
      data: [
        {
          name: 'Tech One',
          email: 'techone@example.com',
          passwordHash: await hash('hashedpassword', 10),
          role: 'TECHNICAL',
        },
        {
          name: 'Tech Two',
          email: 'techtwo@example.com',
          passwordHash: await hash('hashedpassword', 10),
          role: 'TECHNICAL',
        },
        {
          name: 'Tech Three',
          email: 'techthree@example.com',
          passwordHash: await hash('hashedpassword', 10),
          role: 'TECHNICAL',
        },
      ],
    })

    const reply = await request(app.server)
      .get('/technicals')
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toEqual(200)

    expect(reply.body.technicals).toHaveLength(3)
  })
})
