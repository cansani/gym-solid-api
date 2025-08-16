import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "@/services/authenticate";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-err";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const authenticateService = new AuthenticateService(usersRepository)

        await authenticateService.handle({
            email,
            password
        })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            reply.status(400).send({
                message: err.message
            })
        }

        throw err
    }

    reply.send({
        access_token: ""
    })
}