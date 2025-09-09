import { verifyJwt } from "@/middlewares/verify-jwt";
import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";
import { verifyUserRole } from "@/middlewares/verify-user-role";
import z from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-typed-instance";

export async function gymsRoutes(app: FastifyTypedInstance) {
    app.addHook("onRequest", verifyJwt)
    
    app.get("/search", {
        schema: {
            tags: ["Gyms"],
            description: "Search gyms.",
            querystring: z.object({
                q: z.string(),
                page: z.coerce.number().min(1).default(1)
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                200: z.array(
                    z.object({
                        id: z.uuid(),
                        name: z.string(),
                        description: z.string().optional(),
                        phone: z.string().optional(),
                        latitude: z.number(),
                        longitue: z.number()
                    })
                )
            }
        }
    }, search)
    
    app.get("/nearby", {
        schema: {
            tags: ["Gyms"],
            description: "Search nearby gyms.",
            querystring: z.object({
                latitude: z.coerce.number().refine((value) => {
                    return Math.abs(value) <= 90
                }),
                longitude: z.coerce.number().refine((value) => {
                    return Math.abs(value) <= 180
                })
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                200: z.array(
                    z.object({
                        id: z.uuid(),
                        name: z.string(),
                        description: z.string().optional(),
                        phone: z.string().optional(),
                        latitude: z.number(),
                        longitue: z.number()
                    })
                )
            }
        }
    }, nearby)

    app.post("/", { 
        onRequest: verifyUserRole("ADMIN"),
        schema: {
            tags: ["Gyms"],
            description: "Create a gym.",
            body: z.object({
                name: z.string(),
                description: z.string(),
                phone: z.string(),
                latitude: z.number().refine((value) => {
                    return Math.abs(value) <= 90
                }),
                longitude: z.number().refine((value) => {
                    return Math.abs(value) <= 180
                })
            }),
            headers: z.object({
                Authorization: z.string().startsWith("Bearer ")
            }),
            response: {
                201: z.null().describe("Gym created.")
            }
        }
    }, create)
}