import fastify from "fastify"
import z, { ZodError } from "zod"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { usersRoutes } from "./http/controllers/users/routes"
import { gymsRoutes } from "./http/controllers/gyms/routes"
import { checkInsRoutes } from "./http/controllers/check-ins/routes"
import fastifyCookie from "@fastify/cookie"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Gym API",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
})

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: '10m'
    },
    cookie: {
        cookieName: 'refreshToken',
        signed: false
    }
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes, { prefix: "/gyms" })
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
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