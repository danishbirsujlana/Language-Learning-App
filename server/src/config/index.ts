import * as dotenv from "dotenv";
dotenv.config();

type ConfigType = {
    DB_URL: string;
    PORT: string | number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRY: string;
    JWT_EXPIRY: string;
}

const CONFIG: ConfigType = {
    DB_URL: process.env.DB_CONNECTION || "",
    PORT: process.env.PORT || 2020,
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "",
};

export default CONFIG;