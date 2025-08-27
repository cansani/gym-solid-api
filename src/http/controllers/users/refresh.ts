import { RefreshTokenError } from "@/services/errors/refresh-token-err";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true })
    } catch (err) {
        throw new RefreshTokenError()
    }
    

    const userId = request.user.sub

    const accessToken = await reply.jwtSign(
        {
            role: request.user.role
        },
        {
            sub: userId
        }
    )

    const refreshToken = await reply.jwtSign(
        {
            role: request.user.role
        },
        {
            sub: userId,
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
}