import { app } from '../app'

app.addHook('onRequest', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ message: 'Unauthorized' })
  }
})
