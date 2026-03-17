import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ExcelBatchJobData } from '../queues/excel.queue';
export declare class ExcelWorker extends WorkerHost {
    private readonly logger;
    process(job: Job<ExcelBatchJobData, any, string>): Promise<any>;
    private simulateDatabaseInsertion;
}
