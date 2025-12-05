import { CreateUserDTO, UserForClient } from "src/modules/user/dto/user.dto";

export type SignInDTO = Pick<CreateUserDTO, 'email' | 'password'>;
export type SignUpDTO = CreateUserDTO;
export type AuthResponseDTO = {
    token: string,
    user: UserForClient,
}