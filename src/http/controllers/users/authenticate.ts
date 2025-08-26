import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-err";
import { makeAuthenticateService } from "@/services/factories/make-authenticate-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const authenticateService = makeAuthenticateService()

        const { user } = await authenticateService.handle({
            email,
            password
        })

        const access_token = await reply.jwtSign(
            {},
            {
                sign: {
                    sub: user.id
                }
            }
        )

        return reply.send({
            access_token
        })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            reply.status(400).send({
                message: err.message
            })
        }

        throw err
    }
}