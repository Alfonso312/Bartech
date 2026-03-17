import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { EXCEL_QUEUE, EXCEL_PROCESS_JOB, ExcelBatchJobData } from '../queues/excel.queue';

@Processor(EXCEL_QUEUE)
export class ExcelWorker extends WorkerHost {
  private readonly logger = new Logger(ExcelWorker.name);

  async process(job: Job<ExcelBatchJobData, any, string>): Promise<any> {
    if (job.name === EXCEL_PROCESS_JOB) {
      const { batchNumber, totalBatches, records } = job.data;
      
      this.logger.log(`Processing batch ${batchNumber}/${totalBatches} with ${records.length} records...`);
      
      try {
        // Simulate database insertion or processing
        // Here is where you would iterate over 'records' and use a Repository or Service to save them
        await this.simulateDatabaseInsertion(records);
        
        this.logger.log(`Successfully processed batch ${batchNumber}/${totalBatches}`);
        return { success: true, processed: records.length };
      } catch (error) {
        this.logger.error(`Error processing batch ${batchNumber}/${totalBatches}`);
        this.logger.error(error);
        throw error;
      }
    }
  }

  private async simulateDatabaseInsertion(records: any[]): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}
