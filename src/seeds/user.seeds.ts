import { faker } from "@faker-js/faker"
import { CreateUserDTO } from "src/modules/user/dto/user.dto";

export const generateUserForSeed = () => {
    const userForSeed:CreateUserDTO = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(["GUEST", "ADMIN"])
    }
    return userForSeed;
}




