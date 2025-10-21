import type { FastifyInstance } from 'fastify'
import { createNewTechnical } from './create-new-technical'
import { fetchManyTechnicals } from './fetch-many-technicals'
import { updateTechnical } from './update-technical'

export function technicalsRoutes(app: FastifyInstance) {
  app.register(createNewTechnical)
  app.register(fetchManyTechnicals)
  app.register(updateTechnical)
}
