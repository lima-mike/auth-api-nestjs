import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest
        .fn()
        .mockResolvedValue({ userId: 1, email: 'test@example.com' }),
      login: jest.fn().mockResolvedValue({ accessToken: 'xx.yy.zz' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should return the result from AuthService.register', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = await authController.register(registerDto);

      expect(result).toEqual({ userId: 1, email: 'test@example.com' });
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should return the result from AuthService.login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = await authController.login(loginDto);

      expect(result).toEqual({ accessToken: 'xx.yy.zz' });
    });
  });
});
