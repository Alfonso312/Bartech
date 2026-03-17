import { Queue } from 'bullmq';
export declare class ExcelService {
    private audioQueue;
    private readonly logger;
    private readonly BATCH_SIZE;
    constructor(audioQueue: Queue);
    processExcelFile(file: Express.Multer.File): Promise<{
        message: string;
        totalRecords: number;
        batchesCreated: number;
        batchSize?: undefined;
    } | {
        message: string;
        totalRecords: number;
        batchesCreated: number;
        batchSize: number;
    }>;
}
