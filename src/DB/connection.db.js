import {MongoClient} from "mongodb";
import { configService } from "../../config/config.service.js";

const client = new MongoClient(configService.mongo_uri);

export const db = client.db(configService.db_name);

export const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB 💯🥳");
    } catch (error) {
        console.error("Error connecting to MongoDB ❌😶‍🌫️", error);
    }
}