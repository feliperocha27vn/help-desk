import { app } from '@/app'
import { prisma } from '@/lib/prisma'
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
    const reply = await request(app.server).post('/admins').send({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(reply.statusCode).toEqual(201)

    const admin = await prisma.admins.findFirstOrThrow({
      where: { email: 'admin@test.com' },
    })

    expect(admin).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Admin Test',
        email: 'admin@test.com',
      })
    )
  })
})
