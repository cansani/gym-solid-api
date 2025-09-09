import { verifyJwt } from "@/middlewares/verify-jwt";
import { create } from "./create";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import z from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-typed-instance";

export async function checkInsRoutes(app: FastifyTypedInstance) {
    app.addHook("onRequest", verifyJwt)

    app.get("/check-ins/history", {
        schema: {
            tags: ["Check-ins"],
            description: "Get check-ins history.",
            querystring: z.object({
                page: z.coerce.number().min(1).default(1)
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                200: z.array(
                    z.object({
                        id: z.uuid(),
                        created_at: z.date(),
                        validated_at: z.date().optional(),
                        user_id: z.uuid(),
                        gym_id: z.uuid(),
                    })
                )
            }
        }
    }, history)
    
    app.get("/check-ins/metrics", {
        schema: {
            tags: ["Check-ins"],
            description: "Get check-ins history.",
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                200: z.object({
                    checkInsCount: z.number()
                })
            }
        }
    }, metrics)
    
    app.post("/gyms/:gymId/check-ins", {
        schema: {
            tags: ["Check-ins"],
            description: "Create a check-in.",
            params: z.object({
                gymId: z.uuid()
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            body: z.object({
                latitude: z.coerce.number().refine((value) => {
                    return Math.abs(value) <= 90
                }),
                longitude: z.coerce.number().refine((value) => {
                    return Math.abs(value) <= 180
                })
            }),
            response: {
                201: z.null().describe("Check-in created.")
            }
        }
    }, create)

    app.patch("/check-ins/:checkInId/validate", {
        schema: {
            tags: ["Check-ins"],
            description: "Create a check-in.",
            params: z.object({
                checkInId: z.uuid()
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                204: z.null().describe("Check-in validated.")
            }
        }
    }, validate)
}