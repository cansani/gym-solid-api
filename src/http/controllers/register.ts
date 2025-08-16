import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-err";
import { RegisterService } from "@/services/register";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const registerService = new RegisterService(usersRepository)

        await registerService.handle({ name, email, password })
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            reply.status(409).send({
                message: err.message
            })
        }

        throw err
    }

    reply.status(201)
}