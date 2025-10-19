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

describe('Update admin', () => {
  it('should be able update admin', async () => {
    const { token } = await createAndAuthenticationUser(app, 'ADMIN')

    const reply = await request(app.server)
      .patch('/admins')
      .send({
        email: 'adminAtualizado@test.com',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toEqual(204)

    const user = await prisma.users.findFirst({})

    expect(user).toEqual(
      expect.objectContaining({
        email: 'adminAtualizado@test.com',
      })
    )
  })

  it('should not be able update admin, if role is not ADMIN', async () => {
    const { token } = await createAndAuthenticationUser(app, 'CUSTOMER')

    const reply = await request(app.server)
      .patch('/admins')
      .send({
        email: 'adminAtualizado@test.com',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toEqual(409)
  })
})
