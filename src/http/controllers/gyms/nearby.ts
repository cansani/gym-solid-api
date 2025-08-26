import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymRequestQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = nearbyGymRequestQuerySchema.parse(request.query)

    const nearbyGym = makeFetchNearbyGymsService()

    const { gyms } = await nearbyGym.handle({
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(200).send({
        gyms
    })
}