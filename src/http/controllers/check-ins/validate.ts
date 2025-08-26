import { makeCheckInService } from "@/services/factories/make-check-in-service";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.uuid()
    })

    const { checkInId } = validateCheckInParamsSchema.parse(request.params)

    const validateCheckIn = makeValidateCheckInService()

    await validateCheckIn.handle({
        checkInId
    })

    return reply.status(204)
}