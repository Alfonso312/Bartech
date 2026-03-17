"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ExcelService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const xlsx = __importStar(require("xlsx"));
const excel_queue_1 = require("../queues/excel.queue");
let ExcelService = ExcelService_1 = class ExcelService {
    audioQueue;
    logger = new common_1.Logger(ExcelService_1.name);
    BATCH_SIZE = 1000;
    constructor(audioQueue) {
        this.audioQueue = audioQueue;
    }
    async processExcelFile(file) {
        this.logger.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        this.logger.log(`Parsed ${data.length} total records from ${file.originalname}`);
        const totalBatches = Math.ceil(data.length / this.BATCH_SIZE);
        if (data.length === 0) {
            return { message: 'File is empty', totalRecords: 0, batchesCreated: 0 };
        }
        for (let i = 0; i < totalBatches; i++) {
            const batchRecords = data.slice(i * this.BATCH_SIZE, (i + 1) * this.BATCH_SIZE);
            const batchData = {
                batchNumber: i + 1,
                totalBatches,
                records: batchRecords,
            };
            await this.audioQueue.add(excel_queue_1.EXCEL_PROCESS_JOB, batchData, {
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
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = ExcelService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)(excel_queue_1.EXCEL_QUEUE)),
    __metadata("design:paramtypes", [bullmq_2.Queue])
], ExcelService);
//# sourceMappingURL=excel.service.js.map