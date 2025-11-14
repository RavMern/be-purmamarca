/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from 'src/entities/users.entity';
import { LoginUserDto, UserDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({
    type: UserDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de registro',
        value: {
          name: 'Juan Pérez',
          email: 'juan@mail.com',
          password: '123456',
          isAdmin: false,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuario registrado exitosamente',
    type: Users,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o usuario ya existe',
  })
  async signUp(@Body() userDto: UserDto): Promise<Users> {
    return this.authService.signUp(userDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    type: LoginUserDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de login',
        value: {
          email: 'juan@mail.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        success: 'User logged in successfully',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async logIn(@Body() user: LoginUserDto): Promise<any> {
    return this.authService.login(user.email, user.password);
  }
}
