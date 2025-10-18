import { EmailAlreadyExistsError } from '@/errors/email-already-exists'
import { createNewAdmin } from '@/functions/admins/create-new-admin'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createNewAdmion: FastifyPluginAsyncZod = async app => {
  app.post(
    '/admins',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.void(),
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
      const { name, email, password } = request.body

      try {
        await createNewAdmin({ name, email, password })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(409).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
