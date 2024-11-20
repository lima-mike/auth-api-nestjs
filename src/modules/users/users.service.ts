import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByIdIfActive(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id, isActive: true } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    registerDto: RegisterDto,
    hashedPassword: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: { ...registerDto, password: hashedPassword },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async deactivateAccount(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async reactivateAccount(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }
}
