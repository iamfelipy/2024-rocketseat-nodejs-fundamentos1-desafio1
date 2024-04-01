import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const users = [
  { id: '1', name: 'maik', email: 'maik@gmail.com' },
  { id: '2', name: 'paulo', email: 'paulo@gmail.com' },
]

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // criar schema de validação
    // verificar se existe sessionId
    // criar sessionId se não existir
    // validar se o body veio corretamente
    // procurar se o usuário já existe
    // retornar 400 se o usuário já existir
    // criar usuario
    // retornar status 201 que significa que foi um sucesso a criação

    const createUserSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserSchema.parse(request.body)

    const userExists = users.findIndex((user) => user.email.includes(email))

    if (userExists >= 0) {
      return reply.status(400).send({ message: 'User already exists.' })
    }

    users.push({
      id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })
}
