import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
    await request(app.server).post("/users").send({
        name: "John",
        email: "john@email.com",
        password: "123456"
    })

    const response = await request(app.server).post("/sessions").send({
        email: "john@email.com",
        password: "123456"
    })

    const access_token = response.body.access_token

    return {
        access_token
    }
}