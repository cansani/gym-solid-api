import fastify from "fastify"
import { appRoutes } from "./http/routes"
import z, { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        reply.status(400).send({
            message: "Erro de validação.",
            issues: z.prettifyError(error)
        })
    }

    if (env.NODE_ENV !== "production") {
        console.error(error)
    } else {
        //Observabilidade, Datadog/Sentry, etc...
    }

    return reply.status(500).send({
        message: "Internal server error."
    })
})