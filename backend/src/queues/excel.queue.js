import { Queue } from "bullmq";

export const excelQueue = new Queue("excel-processing", {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    },
});