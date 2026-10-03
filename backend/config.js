import dotenv from "dotenv";

dotenv.config();

const tokenDB = process.env.TOKEN_DB;
const urlDB = process.env.URL_DB;
const port = process.env.PORT ?? 3000;
const env = process.env.NODE_ENV ?? "development";
const accessToken = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshToken = process.env.REFRESH_TOKEN_SECRET;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

const config = {
  tokenDB,
  urlDB,
  port,
  env,
  accessToken,
  accessTokenExpiresIn,
  refreshToken,
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret
};

export default config;