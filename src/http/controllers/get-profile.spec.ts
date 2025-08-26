import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app";
import { afterEach } from "node:test";

describe("Get Profile (e2e)", async () => {
    beforeEach(async () => {
        await app.ready()
    })

    afterEach(async () => {
        await app.close()
    })

    it("should be able to get profile", async () => {
        await request(app.server).post("/users").send({
            name: "John",
            email: "john@email.com",
            password: "123456"
        })

        const authenticateResponse = await request(app.server).post("/sessions").send({
            email: "john@email.com",
            password: "123456"
        })

        const jwtToken = authenticateResponse.body.access_token

        const response = await request(app.server).get("/me").set('Authorization', `Bearer ${jwtToken}`)

        expect(response.statusCode).toEqual(200)
        expect(response.body.user).toEqual(expect.objectContaining({
            email: "john@email.com"
        }))
    })
})