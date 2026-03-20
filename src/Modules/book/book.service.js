// Requirements 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
import { ObjectId, Int32 } from "mongodb";
import { db } from "../../DB/connection.db.js";
import { BookModel } from "../../DB/Models/index.js";
import { AppError } from "../../common/res/index.js";

export const insertOneBook = async (body) => {
    const { title, author, year, genres } = body;

    if (!title || !author || year === undefined || !genres) {
        AppError({ message: "title, author, year, genres are all required", cause: { statusCode: 400 } });
    }
    if (!Array.isArray(genres)) {
        AppError({ message: "genres must be an array", cause: { statusCode: 400 } });
    }

    const result = await BookModel.insertOne({
        title,
        author,
        year: new Int32(parseInt(year)),
        genres,
    });

    return { acknowledged: result.acknowledged, insertedId: result.insertedId };
};

export const insertManyBooks = async (body) => {
    const { books } = body;

    if (!books || !Array.isArray(books) || books.length < 3) {
        AppError({
            message: "Provide at least 3 books in a 'books' array",
            cause: { statusCode: 400 },
        });
    }

    const docs = books.map((b) => ({
        title: b.title,
        author: b.author,
        year: new Int32(parseInt(b.year)),
        genres: b.genres,
    }));

    const result = await BookModel.insertMany(docs);

    return {
        acknowledged: result.acknowledged,
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
    };
};

export const updateBookByTitle = async (title, body) => {
    const { year } = body;

    if (year === undefined) {
        AppError({ message: "year is required in request body", cause: { statusCode: 400 } });
    }

    const result = await BookModel.updateOne(
        { title },
        { $set: { year: new Int32(parseInt(year)) } }
    );

    if (result.matchedCount === 0) {
        AppError({ message: `Book with title "${title}" not found`, cause: { statusCode: 404 } });
    }

    return {
        acknowledged: result.acknowledged,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
    };
};

export const findBookByTitle = async (title) => {
    if (!title) {
        AppError({ message: "title query param is required", cause: { statusCode: 400 } });
    }

    const book = await BookModel.findOne({ title });

    if (!book) {
        AppError({ message: `Book "${title}" not found`, cause: { statusCode: 404 } });
    }

    return book;
};

export const findBooksByYearRange = async (from, to) => {
    if (!from || !to) {
        AppError({ message: "from and to query params are required", cause: { statusCode: 400 } });
    }

    return await BookModel.find({
        year: { $gte: parseInt(from), $lte: parseInt(to) },
    }).toArray();
};

export const findBooksByGenre = async (genre) => {
    if (!genre) {
        AppError({ message: "genre query param is required", cause: { statusCode: 400 } });
    }
    return await BookModel.find({ genres: genre }).toArray();
};

export const findBooksSkipLimitSort = async () => {
    return await BookModel.find({})
        .sort({ year: -1 })
        .skip(2)
        .limit(3)
        .toArray();
};

export const findBooksByYearInteger = async () => {
    return await BookModel.find({ year: { $type: "int" } }).toArray();
};

export const findBooksExcludeGenres = async () => {
    return await BookModel.find({
        genres: { $nin: ["Horror", "Science Fiction"] },
    }).toArray();
};

export const deleteBooksBeforeYear = async (year) => {
    if (!year) {
        AppError({ message: "year query param is required", cause: { statusCode: 400 } });
    }

    const result = await BookModel.deleteMany({
        year: { $lt: parseInt(year) },
    });

    return { acknowledged: result.acknowledged, deletedCount: result.deletedCount };
};

export const aggregateMatchSort = async () => {
    return await BookModel.aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $sort:  { year: -1 } },
    ]).toArray();
};

export const aggregateMatchProject = async () => {
    return await BookModel.aggregate([
        { $match:   { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ]).toArray();
};

export const aggregateUnwindGenres = async () => {
    return await BookModel.aggregate([
        { $unwind:  "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
    ]).toArray();
};

export const aggregateLookupWithLogs = async () => {
    return await db.collection("logs").aggregate([
        {
            $lookup: {
                from:         "books",
                localField:   "book_id",
                foreignField: "_id",
                as:           "book_details",
            },
        },
        {
            $project: {
                _id: 0,
                action: 1,
                "book_details.title":  1,
                "book_details.author": 1,
                "book_details.year":   1,
            },
        },
    ]).toArray();
};