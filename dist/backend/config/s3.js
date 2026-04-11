"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_CONFIG = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
if (!process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('AWS credentials not configured:', {
        AWS_REGION: process.env.AWS_REGION ? 'set' : 'missing',
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 'set' : 'missing',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
            ? 'set'
            : 'missing',
    });
    throw new Error('AWS credentials are required. Please set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables.');
}
exports.s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
exports.S3_CONFIG = {
    BUCKET_NAME: process.env.BUCKET_NAME,
    REGION: process.env.AWS_REGION,
    FOLDER_PREFIX: 'user-content',
    PRESIGNED_URL_EXPIRY: 3600, // 1 hour in seconds
};
