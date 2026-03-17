import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as xlsx from 'xlsx';
import { EXCEL_QUEUE, EXCEL_PROCESS_JOB, ExcelBatchJobData } from '../queues/excel.queue';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);
  private readonly BATCH_SIZE = 1000;

  constructor(@InjectQueue(EXCEL_QUEUE) private audioQueue: Queue) {}

  async processExcelFile(file: Express.Multer.File) {
    this.logger.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);
    
    // Parse the Excel file from buffer
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data: any[] = xlsx.utils.sheet_to_json(worksheet);
    this.logger.log(`Parsed ${data.length} total records from ${file.originalname}`);

    // Chunk the data
    const totalBatches = Math.ceil(data.length / this.BATCH_SIZE);
    
    if (data.length === 0) {
      return { message: 'File is empty', totalRecords: 0, batchesCreated: 0 };
    }

    for (let i = 0; i < totalBatches; i++) {
      const batchRecords = data.slice(i * this.BATCH_SIZE, (i + 1) * this.BATCH_SIZE);
      const batchData: ExcelBatchJobData = {
        batchNumber: i + 1,
        totalBatches,
        records: batchRecords,
      };

      // Add to queue
      await this.audioQueue.add(EXCEL_PROCESS_JOB, batchData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      });
      
      this.logger.log(`Added batch ${i + 1}/${totalBatches} to queue (${batchRecords.length} records)`);
    }

    return {
      message: 'File processing started',
      totalRecords: data.length,
      batchesCreated: totalBatches,
      batchSize: this.BATCH_SIZE
    };
  }
}
