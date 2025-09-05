/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto, UserDto } from "src/users/users.dto";
import { Users } from "src/entities/users.entity";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('signup')
    async signUp( @Body()userDto: UserDto):Promise<Users>{
        return this.authService.signUp(userDto)
    }

    @Post('login')
    async logIn(@Body()user:LoginUserDto):Promise<any>{
        return this.authService.login(user.email, user.password)
    }

}