import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { fetchManyTechnicalsFunction } from '@/functions/technicals/fetch-many-technicals'
import { verifyJwt } from '@/middlewares/jwt-verify'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchManyTechnicals: FastifyPluginAsyncZod = async app => {
  app.get(
    '/technicals',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        response: {
          200: z.object({
            technicals: z.array(
              z.object({
                name: z.string(),
                email: z.string().email(),
              })
            ),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      try {
        const { technicals } = await fetchManyTechnicalsFunction()

        return reply.status(200).send({ technicals })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
