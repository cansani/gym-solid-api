import { UsersRepository } from "@/repositories/users-repository";
import { User } from "generated/prisma";
import { ResorceNotFoundError } from "./errors/resource-not-found.err";

interface GetUserProfileRequest {
    userId: string
}

interface GetUserProfileResponse {
    user: User
}

export class GetUserProfileService {
    constructor(
        private usersRepository: UsersRepository
    ) {}

    async handle({ userId }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResorceNotFoundError() 
        }

        return {
            user
        }
    }
}