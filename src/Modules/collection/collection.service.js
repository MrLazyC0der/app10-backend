import { db } from "../../DB/connection.db.js";
import { AppError } from "../../common/res/index.js";

export const createBooksCollection = async () => {
    const schema = {
        bsonType: "object",
        required: ["title"],
        properties: {
            title: {
                bsonType: "string",
                minLength: 1,
                description: "Title is required and must be a non-empty string",
            },
            author: { bsonType: "string" },
            year:   { bsonType: "int" },
            genres: { bsonType: "array", items: { bsonType: "string" } },
        },
    };

    try {
        await db.createCollection("books", { validator: { $jsonSchema: schema } });
    } catch (error) {
        if (error.codeName !== "NamespaceExists") throw error;
    }

    return { ok: 1 };
};

export const createAuthorsCollection = async (body) => {
    const { name, nationality } = body;

    if (!name || !nationality) {
        AppError({
            message: "name and nationality are required",
            cause: { statusCode: 400 },
        });
    }

    const result = await db.collection("authors").insertOne({ name, nationality });

    return { acknowledged: result.acknowledged, insertedId: result.insertedId };
};

export const createCappedLogsCollection = async () => {
    try {
        await db.createCollection("logs", {
            capped: true,
            size: 1024 * 1024, // 1 MB
        });
    } catch (error) {
        if (error.codeName !== "NamespaceExists") throw error;
    }

    return { ok: 1 };
};

export const createBooksTitleIndex = async () => {
    const indexName = await db.collection("books").createIndex({ title: 1 });
    return indexName; 
};