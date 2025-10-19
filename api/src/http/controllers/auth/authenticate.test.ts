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

describe('Authenticate user', () => {
  it('should be able authenticate user', async () => {
    await prisma.users.create({
      data: {
        name: 'Admin Test',
        email: 'admin@test.com',
        passwordHash: await hash('admin123', 6),
        role: 'ADMIN',
      },
    })

    const reply = await request(app.server).post('/sessions').send({
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(reply.statusCode).toEqual(200)
    expect(reply.body).toEqual({
      token: expect.any(String),
    })
  })
})
