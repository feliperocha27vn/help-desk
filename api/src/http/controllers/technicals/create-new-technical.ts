import { verifyJwt } from '@/middlewares/jwt-verify'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const createNewTechnical: FastifyPluginAsyncZod = async app => {
  app.post(
    '/technicals',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {},
    },
    async (request, reply) => {}
  )
}
