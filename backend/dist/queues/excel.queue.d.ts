export declare const EXCEL_QUEUE = "excel-queue";
export declare const EXCEL_PROCESS_JOB = "process-excel-batch";
export interface ExcelBatchJobData {
    batchNumber: number;
    totalBatches: number;
    records: any[];
}
