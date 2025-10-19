import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticationUser(
  app: FastifyInstance,
  role: 'ADMIN' | 'TECHNICAL' | 'CUSTOMER'
) {
  await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
      role,
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
