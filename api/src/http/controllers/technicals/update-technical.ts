import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { updateTechnicalFunction } from '@/functions/technicals/update-technical'
import { verifyJwt } from '@/middlewares/jwt-verify'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const updateTechnical: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/technicals/:technicalId',
    {
      onRequest: [verifyJwt, verifyUserRole(['ADMIN', 'TECHNICAL'])],
      schema: {
        params: z.object({
          technicalId: z.uuid(),
        }),
        body: z.object({
          name: z.string().min(3).optional(),
          email: z.email().optional(),
        }),
        response: {
          204: z.void({}),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body
      const { technicalId } = request.params

      try {
        await updateTechnicalFunction({
          technicalId,
          name,
          email,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
