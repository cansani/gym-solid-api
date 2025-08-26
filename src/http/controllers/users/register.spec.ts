import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest"
import { app } from "@/app";
import { afterEach } from "node:test";

describe("Register (e2e)", async () => {
    beforeEach(async () => {
        await app.ready()
    })

    afterEach(async () => {
        await app.close()
    })

    it("should be able to register", async () => {
        const response = await request(app.server).post("/users").send({
            name: "John",
            email: "john@email.com",
            password: "123456"
        })

        expect(response.statusCode).toEqual(201)
    })
})