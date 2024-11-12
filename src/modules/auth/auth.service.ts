import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateJwt(userId: number): Promise<string> {
    return this.jwtService.sign({ userId });
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.usersService.findByEmail(email);
    if (user) throw new UnauthorizedException('User already exists');

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.createUser(
      registerDto,
      hashedPassword,
    );

    return { userId: newUser.id, email: newUser.email };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValidPassword = await this.comparePasswords(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateJwt(user.id);

    return { accessToken: token };
  }
}
