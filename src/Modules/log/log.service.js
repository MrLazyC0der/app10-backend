import { ObjectId } from "mongodb";
import { LogModel } from "../../DB/Models/index.js";
import { BookModel } from "../../DB/Models/index.js";
import { AppError } from "../../common/res/index.js";

export const insertLog = async (body) => {
    const { book_id, action } = body;

    if (!book_id || !action) {
        AppError({ message: "book_id and action are required", cause: { statusCode: 400 } });
    }
    if (!ObjectId.isValid(book_id)) {
        AppError({ message: "book_id must be a valid MongoDB ObjectId", cause: { statusCode: 400 } });
    }

    const bookExists = await BookModel.findOne({ _id: new ObjectId(book_id) });
    if (!bookExists) {
        AppError({ message: "Book not found — cannot insert log for non-existing book", cause: { statusCode: 404 } });
    }
    const result = await LogModel.insertOne({
        book_id: new ObjectId(book_id),
        action,
        createdAt: new Date(),
    });

    return { acknowledged: result.acknowledged, insertedId: result.insertedId };
};
