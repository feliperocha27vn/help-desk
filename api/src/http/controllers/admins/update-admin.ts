import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { updateAdminFunction } from '@/functions/admins/update-admin'
import { verifyJwt } from '@/middlewares/jwt-verify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const updateAdmin: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/admins',
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          name: z.string().optional(),
          email: z.email().optional(),
        }),
        response: {
          204: z.void(),
          409: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body

      try {
        await updateAdminFunction({
          adminId: request.user.sub,
          role: request.user.role,
          name,
          email,
        })

        return reply.status(204).send()
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(409).send({ message: error.message })
        }

        if (error instanceof InvalidCredentialsError) {
          return reply.status(409).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
