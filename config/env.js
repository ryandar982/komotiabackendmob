import dotenv from "dotenv";
dotenv.config();

export const APP_PORT = process.env.APP_PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "gateway01.ap-southeast-1.prod.aws.tidbcloud.com";
export const DB_USER = process.env.DB_USER || "49Te45F4wYinJFG.root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "Iv2R4zYAFaNo17a8";
export const DB_NAME = process.env.DB_NAME || "komotia";
export const DB_PORT = process.env.DB_PORT || 4000;