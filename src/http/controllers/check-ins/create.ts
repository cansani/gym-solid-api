import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.uuid()
    })

    const createCheckInRequestBodySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = createCheckInRequestBodySchema.parse(request.body)

    const { gymId } = createCheckInParamsSchema.parse(request.params)

    const checkInsService = makeCheckInService()

    const userId = request.user.sub

    await checkInsService.handle({
        gymId,
        userId,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201)
}