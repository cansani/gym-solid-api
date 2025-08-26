import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createGymRequestBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        phone: z.string(),
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        })
    })

    const { name, description, phone, latitude, longitude } = createGymRequestBodySchema.parse(request.body)

    const createGymService = makeCreateGymService()

    await createGymService.handle({
        name,
        description,
        phone,
        latitude,
        longitude
    })

    return reply.status(201)
}