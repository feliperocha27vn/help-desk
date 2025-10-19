import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { deleteAdminFunction } from '@/functions/admins/delete-admin'
import { verifyJwt } from '@/middlewares/jwt-verify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const deleteAdmin: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/admins',
    {
      onRequest: [verifyJwt],
      schema: {
        response: {
          204: z.void(),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        await deleteAdminFunction({
          adminId: request.user.sub,
          role: request.user.role,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return reply.status(409).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
