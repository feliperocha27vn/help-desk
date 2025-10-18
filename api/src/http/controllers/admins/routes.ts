import type { FastifyInstance } from 'fastify'
import { createNewAdmion } from './create-new-admin'

export function adminsRoutes(app: FastifyInstance) {
  app.register(createNewAdmion)
}
