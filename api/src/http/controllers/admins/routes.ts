import type { FastifyInstance } from 'fastify'
import { createNewAdmion } from './create-new-admin'
import { deleteAdmin } from './delete-admin'
import { fetchAllAdmins } from './fetch-all-admins'
import { updateAdmin } from './update-admin'

export function adminsRoutes(app: FastifyInstance) {
  app.register(createNewAdmion)
  app.register(fetchAllAdmins)
  app.register(updateAdmin)
  app.register(deleteAdmin)
}
