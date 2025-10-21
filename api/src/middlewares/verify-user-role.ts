import type { FastifyReply, FastifyRequest } from 'fastify'

type Role = 'ADMIN' | 'TECHNICAL' | 'CUSTOMER'

export function verifyUserRole(roleToVerify: Role | Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user as { role?: Role }

    const allowed = Array.isArray(roleToVerify) ? roleToVerify : [roleToVerify]

    if (!role || !allowed.includes(role)) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
