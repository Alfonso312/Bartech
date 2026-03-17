import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ExcelController } from './controllers/excel.controller';
import { ExcelService } from './services/excel.service';
import { ExcelWorker } from './workers/excel.worker';
import { EXCEL_QUEUE } from './queues/excel.queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EXCEL_QUEUE,
    }),
  ],
  controllers: [ExcelController],
  providers: [ExcelService, ExcelWorker],
})
export class ExcelModule {}
