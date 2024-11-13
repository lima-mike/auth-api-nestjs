import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let dbIndicator: TypeOrmHealthIndicator;
  let memoryIndicator: MemoryHealthIndicator;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const mockDbIndicator = {
      pingCheck: jest.fn(),
    };

    const mockMemoryIndicator = {
      checkHeap: jest.fn(),
      checkRSS: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: TypeOrmHealthIndicator, useValue: mockDbIndicator },
        { provide: MemoryHealthIndicator, useValue: mockMemoryIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    dbIndicator = module.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    memoryIndicator = module.get<MemoryHealthIndicator>(MemoryHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should call HealthCheckService.check with database and memory checks', async () => {
      (dbIndicator.pingCheck as jest.Mock).mockResolvedValue({
        database: { status: 'up' },
      });
      (memoryIndicator.checkHeap as jest.Mock).mockResolvedValue({
        memory_heap: { status: 'up' },
      });
      (memoryIndicator.checkRSS as jest.Mock).mockResolvedValue({
        memory_rss: { status: 'up' },
      });

      const checks = [
        expect.any(Function),
        expect.any(Function),
        expect.any(Function),
      ];

      await controller.check();
      expect(healthCheckService.check).toHaveBeenCalledWith(checks);
    });

    it('should return overall health check result', async () => {
      const mockResult = {
        status: 'ok',
        info: {
          database: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
        },
      };

      (dbIndicator.pingCheck as jest.Mock).mockResolvedValue(
        mockResult.info.database,
      );
      (memoryIndicator.checkHeap as jest.Mock).mockResolvedValue(
        mockResult.info.memory_heap,
      );
      (memoryIndicator.checkRSS as jest.Mock).mockResolvedValue(
        mockResult.info.memory_rss,
      );
      (healthCheckService.check as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.check();
      expect(result).toEqual(mockResult);
    });
  });
});
