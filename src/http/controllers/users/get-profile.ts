import { makeGetUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const getUserProfileService = makeGetUserProfileService()
        
        const userId = request.user.sub

        const { user } = await getUserProfileService.handle({
            userId
        })

        return reply.send({
            user: {
                ...user,
                password_hash: undefined
            }
        })
    } catch (err) {
        throw err
    }
}