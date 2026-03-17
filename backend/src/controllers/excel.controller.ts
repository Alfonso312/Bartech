import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../services/excel.service';

@Controller('upload-excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Excel file is required');
    }

    if (!file.originalname.match(/\.(xlsx|xls|csv)$/)) {
        throw new BadRequestException('Only Excel or CSV files are allowed');
    }

    return await this.excelService.processExcelFile(file);
  }
}
