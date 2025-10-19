import type { FastifyInstance } from 'fastify'
import { authenticateUser } from './authenticate'

export function authRoutes(app: FastifyInstance) {
  app.register(authenticateUser)
}
