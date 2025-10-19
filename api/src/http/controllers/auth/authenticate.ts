import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { authenticateUserFunction } from '@/functions/auth/authenticate'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const authenticateUser: FastifyPluginAsyncZod = async app => {
  app.post(
    '/sessions',
    {
      schema: {
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      try {
        const { user } = await authenticateUserFunction({ email, password })

        const token = await reply.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
            },
          }
        )

        const refreshToken = await reply.jwtSign(
          {
            role: user.role,
          },
          {
            sign: {
              sub: user.id,
              expiresIn: '7d',
            },
          }
        )

        return reply
          .status(200)
          .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
          })
          .send({ token })
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          return reply.status(409).send({ error: error.message })
        }

        throw error
      }
    }
  )
}
