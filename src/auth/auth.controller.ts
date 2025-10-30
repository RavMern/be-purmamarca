/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from 'src/entities/users.entity';
import { LoginUserDto, UserDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: UserDto })
  @ApiResponse({
    status: 201,
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
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: { $ref: '#/components/schemas/Users' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async logIn(@Body() user: LoginUserDto): Promise<any> {
    return this.authService.login(user.email, user.password);
  }
}
