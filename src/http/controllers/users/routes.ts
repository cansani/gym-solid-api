import { verifyJwt } from "@/middlewares/verify-jwt";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getProfile } from "./get-profile";
import { refresh } from "./refresh";
import z from "zod";
import { FastifyTypedInstance } from "@/@types/fastify-typed-instance";

export async function usersRoutes(app: FastifyTypedInstance) {
    app.post("/users", {
        schema: {
            tags: ["Users"],
            description: "Create a user.",
            body: z.object({
                name: z.string(),
                email: z.email(),
                password: z.string().min(6)
            }),
            response: {
                201: z.null().describe("User created.")
            }
        }
    }, register)

    app.post("/sessions", {
        schema: {
            tags: ["Auth"],
            description: "Login.",
            body: z.object({
                email: z.email(),
                password: z.string()
            }),
            response: {
                200: z.object({
                    access_token: z.string()
                })
            }
        }
    }, authenticate)

    app.patch("/sessions/refresh", {
        schema: {
            tags: ["Auth"],
            description: "Refresh.",
            response: {
                200: z.object({
                    access_token: z.string()
                })
            }
        }
    }, refresh)

    //Authenticated
    app.get("/me", {
        onRequest: verifyJwt,
        schema: {
            tags: ["Users"],
            description: "Get user informations.",
            response: {
                200: z.object({
                    user: z.object({
                        id: z.uuid(),
                        name: z.string(),
                        email: z.email(),
                        role: z.string(),
                        created_at: z.date()
                    })
                })
            }
        }
    }, getProfile)
}