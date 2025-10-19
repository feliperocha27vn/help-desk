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

describe('Delete admin', () => {
  it('should be able to delete admin', async () => {
    const { token } = await createAndAuthenticationUser(app, 'ADMIN')

    const reply = await request(app.server)
      .delete('/admins')
      .set('Authorization', `Bearer ${token}`)

    expect(reply.statusCode).toEqual(204)

    const user = await prisma.users.findFirst({})

    expect(user).toBeNull()
  })
})
