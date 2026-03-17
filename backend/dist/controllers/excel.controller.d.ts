import { ExcelService } from '../services/excel.service';
export declare class ExcelController {
    private readonly excelService;
    constructor(excelService: ExcelService);
    uploadExcelFile(file: Express.Multer.File): Promise<{
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
