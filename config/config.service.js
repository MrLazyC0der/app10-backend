import {config} from "dotenv";
import {resolve} from "path" ;
const NODE_ENV = process.env.NODE_ENV || "development";
const path = NODE_ENV ==="production" ? resolve("config/.env.production") : resolve("config/.env.development");
config({path});

export const configService = {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    db_name: process.env.DB_NAME,
    
}