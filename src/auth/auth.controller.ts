/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from 'src/entities/users.entity';
import { LoginUserDto, UserDto } from 'src/users/users.dto';
import { AuthService } from './auth.service';

@ApiTags('auth') // Nombre de la sección en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: Users,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async signUp(@Body() userDto: UserDto): Promise<Users> {
    return this.authService.signUp(userDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, devuelve token o datos de sesión',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async logIn(@Body() user: LoginUserDto): Promise<any> {
    return this.authService.login(user.email, user.password);
  }
}
