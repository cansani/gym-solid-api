import { verifyJwt } from "@/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { nearby } from "./nearby";
import { verifyUserRole } from "@/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt)
    
    app.get("/search", search)
    app.get("/nearby", nearby)

    app.post("/", { onRequest: verifyUserRole("ADMIN") }, create)
}