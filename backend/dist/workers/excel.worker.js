"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExcelWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelWorker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const excel_queue_1 = require("../queues/excel.queue");
let ExcelWorker = ExcelWorker_1 = class ExcelWorker extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(ExcelWorker_1.name);
    async process(job) {
        if (job.name === excel_queue_1.EXCEL_PROCESS_JOB) {
            const { batchNumber, totalBatches, records } = job.data;
            this.logger.log(`Processing batch ${batchNumber}/${totalBatches} with ${records.length} records...`);
            try {
                await this.simulateDatabaseInsertion(records);
                this.logger.log(`Successfully processed batch ${batchNumber}/${totalBatches}`);
                return { success: true, processed: records.length };
            }
            catch (error) {
                this.logger.error(`Error processing batch ${batchNumber}/${totalBatches}`);
                this.logger.error(error);
                throw error;
            }
        }
    }
    async simulateDatabaseInsertion(records) {
        return new Promise((resolve) => setTimeout(resolve, 500));
    }
};
exports.ExcelWorker = ExcelWorker;
exports.ExcelWorker = ExcelWorker = ExcelWorker_1 = __decorate([
    (0, bullmq_1.Processor)(excel_queue_1.EXCEL_QUEUE)
], ExcelWorker);
//# sourceMappingURL=excel.worker.js.map