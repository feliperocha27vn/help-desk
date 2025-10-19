import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

describe('Create admin', () => {
  it('should be able to create an admin', async () => {
    await prisma.users.createMany({
      data: [
        {
          name: 'Admin Test',
          email: 'admin@test.com',
          passwordHash: await hash('123456', 10),
          role: 'ADMIN',
        },
        {
          name: 'Admin Test2',
          email: 'admin2@test.com',
          passwordHash: await hash('123456', 10),
          role: 'ADMIN',
        },
      ],
    })

    const reply = await request(app.server).get('/admins')

    expect(reply.status).toBe(200)

    expect(reply.body.admins).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        name: 'Admin Test',
        email: 'admin@test.com',
      }),
      expect.objectContaining({
        id: expect.any(String),
        name: 'Admin Test2',
        email: 'admin2@test.com',
      }),
    ])
  })
})
