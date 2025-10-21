import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error'
import { createNewTechnicalFunction } from '@/functions/technicals/create-new-technical'
import { verifyJwt } from '@/middlewares/jwt-verify'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewTechnical: FastifyPluginAsyncZod = async app => {
  app.post(
    '/technicals',
    {
      onRequest: [verifyJwt, verifyUserRole('ADMIN')],
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.email(),
          password: z.string().min(6),
          start: z.string().optional(),
          end: z.string().optional(),
          breakStart: z.string().nullable().optional(),
          breakEnd: z.string().nullable().optional(),
          slotDuration: z.number().optional(),
        }),
        response: {
          201: z.void({}),
          422: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      try {
        await createNewTechnicalFunction({
          name,
          email,
          password,
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(422).send({ message: error.message })
        }

        throw error
      }
    }
  )
}
