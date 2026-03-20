import express from "express";
import { configService } from "../config/config.service.js";
import { globalErrorHandler } from "./common/res/index.js";
import { connectDB } from "./DB/connection.db.js";
import { collectionRoute } from "./Modules/collection/index.js"; 
import { bookRoute } from "./Modules/book/index.js";
import { logRoute } from "./Modules/log/index.js";               

const bootstrap = async () => {
    const app = express();

    await connectDB(); 

    app.use(express.json());

    app.use("/collection", collectionRoute); 
    app.use("/books", bookRoute);            
    app.use("/logs", logRoute);              

    app.use(globalErrorHandler);

    app.listen(configService.port || 5000, () => {
        console.log(`🚀 Server running on http://localhost:${configService.port || 5000}`);
    });
};

export default bootstrap;