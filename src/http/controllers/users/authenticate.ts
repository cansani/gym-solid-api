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

        const accessToken = await reply.jwtSign(
            {
                role: user.role
            },
            {
                sub: user.id,
            }
        )

        const refreshToken = await reply.jwtSign(
            {
                role: user.role
            },
            {
                sub: user.id,
                expiresIn: '7d'
            }
        )   

        return reply
            .setCookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                path: '/'
            })
            .send({
                access_token: accessToken
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