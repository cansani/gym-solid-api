import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    const getUserMetrics = makeGetUserMetricsService()

    const { checkInsCount } = await getUserMetrics.handle({
        userId: request.user.sub
    })

    return reply.send({
        checkInsCount
    })
}