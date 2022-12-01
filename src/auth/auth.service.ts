import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

export interface JwtPayload {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: {
    email: string;
  };
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        'Такой пользователь уже зарегетсрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.createUser(dto);
    const token = this.generateJwt(user);
    return {
      user: {
        email: user.email,
      },
      token,
    };
  }
  async login(dto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('Неверный логин', HttpStatus.BAD_REQUEST);
    }
    const comparePassword = await compare(dto.password, user.password);
    if (!comparePassword) {
      throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
    }
    const token = this.generateJwt(user);
    return {
      user: {
        email: user.email,
      },
      token,
    };
  }

  generateJwt(user: UserEntity): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  verifyJwt(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
