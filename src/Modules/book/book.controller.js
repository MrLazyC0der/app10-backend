import { Router } from "express";
import * as bookService from "./book.service.js";
import { successResponse } from "../../common/res/index.js";

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", asyncHandler(async (req, res) => {
    const data = await bookService.insertOneBook(req.body);
    return successResponse(res, "Book inserted successfully", data, 201);
}));
router.post("/batch", asyncHandler(async (req, res) => {
    const data = await bookService.insertManyBooks(req.body);
    return successResponse(res, "Books inserted successfully", data, 201);
}));
router.patch("/:title", asyncHandler(async (req, res) => {
    const data = await bookService.updateBookByTitle(req.params.title, req.body);
    return successResponse(res, "Book updated successfully", data);
}));

// Req 15 — DELETE /books/before-year?year=2000
router.delete("/before-year", asyncHandler(async (req, res) => {
    const data = await bookService.deleteBooksBeforeYear(req.query.year);
    return successResponse(res, "Books deleted successfully", data);
}));

router.get("/title", asyncHandler(async (req, res) => {
    const data = await bookService.findBookByTitle(req.query.title);
    return successResponse(res, "Book found", data);
}));
router.get("/year", asyncHandler(async (req, res) => {
    const data = await bookService.findBooksByYearRange(req.query.from, req.query.to);
    return successResponse(res, "Books found", data);
}));
router.get("/genre", asyncHandler(async (req, res) => {
    const data = await bookService.findBooksByGenre(req.query.genre);
    return successResponse(res, "Books found", data);
}));

router.get("/skip-limit", asyncHandler(async (req, res) => {
    const data = await bookService.findBooksSkipLimitSort();
    return successResponse(res, "Books found (skip 2, limit 3, sort year desc)", data);
}));

router.get("/year-integer", asyncHandler(async (req, res) => {
    const data = await bookService.findBooksByYearInteger();
    return successResponse(res, "Books with year stored as integer", data);
}));

router.get("/exclude-genres", asyncHandler(async (req, res) => {
    const data = await bookService.findBooksExcludeGenres();
    return successResponse(res, "Books excluding Horror and Science Fiction", data);
}));

router.get("/aggregate1", asyncHandler(async (req, res) => {
    const data = await bookService.aggregateMatchSort();
    return successResponse(res, "Books after 2000 sorted by year desc", data);
}));

router.get("/aggregate2", asyncHandler(async (req, res) => {
    const data = await bookService.aggregateMatchProject();
    return successResponse(res, "Books after 2000 (title, author, year only)", data);
}));

router.get("/aggregate3", asyncHandler(async (req, res) => {
    const data = await bookService.aggregateUnwindGenres();
    return successResponse(res, "Genres unwound into separate documents", data);
}));
router.get("/aggregate4", asyncHandler(async (req, res) => {
    const data = await bookService.aggregateLookupWithLogs();
    return successResponse(res, "Logs joined with book details", data);
}));

export default router;