/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UserDto } from 'src/users/users.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly jwtService: JwtService
  ) {}

  async signUp(userDto: UserDto): Promise<Users> {
    const { name, email, password } = userDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email }
    });
    if (existingUser) throw new ConflictException('El usuario ya existe');

    let newUser: Users;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!hashedPassword)
        throw new BadRequestException('Error al encriptar la contraseña');
      newUser = await this.usersRepository.create({
        ...userDto,
        password: hashedPassword
      });
    } else {
      newUser = await this.usersRepository.create({ ...userDto });
    }

    newUser.isAdmin = false;
    return await this.usersRepository.save(newUser);
  }
  async login(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('Credenciales Invalidas');

    if (!user.password) {
      const payload = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      };
      const accessToken = this.jwtService.sign(payload);
      return { success: 'External user logged in successfully', accessToken };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new BadRequestException('Credenciales Invalidas');

    const payload = {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };

    const accessToken = this.jwtService.sign(payload);

    return { success: 'User logged in successfully', accessToken };
  }
}
