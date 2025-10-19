import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { fetchAllAdminsFunction } from '@/functions/admins/fetch-all-admins'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const fetchAllAdmins: FastifyPluginAsyncZod = async app => {
  app.get(
    '/admins',
    {
      schema: {
        response: {
          200: z.object({
            admins: z
              .object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              })
              .array(),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (_, reply) => {
      try {
        const { admins } = await fetchAllAdminsFunction()

        return reply.status(200).send({ admins })
      } catch (error) {
        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).send({ message: error.message })
        }

        return reply.status(500).send({ message: 'Internal server error.' })
      }
    }
  )
}
