import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  port: process.env.PORT || 3000,
  dynamicsTenantId: process.env.TENANT_ID,
  dynamicsHost: process.env.HOST,
  dynamicsCliendId: process.env.CLIENT_ID,
  dynamicsUserName: process.env.USERNAME,
  dynamicsPassword: process.env.PASSWORD,
};
