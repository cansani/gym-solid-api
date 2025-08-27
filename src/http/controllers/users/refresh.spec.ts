import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app";
import { afterEach } from "node:test";

describe("Refresh (e2e)", async () => {
    beforeEach(async () => {
        await app.ready()
    })

    afterEach(async () => {
        await app.close()
    })

    it("should be able to refresh token", async () => {
        await request(app.server).post("/users").send({
            name: "John",
            email: "john@email.com",
            password: "123456"
        })

        const authResponse = await request(app.server).post("/sessions").send({
            email: "john@email.com",
            password: "123456"
        })

        const cookies = authResponse.get("Set-Cookie")!

        const response = await request(app.server).patch("/sessions/refresh").set('Cookie', cookies).send()

        expect(response.statusCode).toEqual(200)
    })
})