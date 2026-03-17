"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const excel_controller_1 = require("./controllers/excel.controller");
const excel_service_1 = require("./services/excel.service");
const excel_worker_1 = require("./workers/excel.worker");
const excel_queue_1 = require("./queues/excel.queue");
let ExcelModule = class ExcelModule {
};
exports.ExcelModule = ExcelModule;
exports.ExcelModule = ExcelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: excel_queue_1.EXCEL_QUEUE,
            }),
        ],
        controllers: [excel_controller_1.ExcelController],
        providers: [excel_service_1.ExcelService, excel_worker_1.ExcelWorker],
    })
], ExcelModule);
//# sourceMappingURL=excel.module.js.map