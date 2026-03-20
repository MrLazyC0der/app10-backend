import { Router } from "express";
import * as collectionService from "./collection.service.js";
import { successResponse } from "../../common/res/index.js";

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/books", asyncHandler(async (req, res) => {
    const data = await collectionService.createBooksCollection();
    return successResponse(res, "Books collection created with validation", data, 201);
}));
router.post("/authors", asyncHandler(async (req, res) => {
    const data = await collectionService.createAuthorsCollection(req.body);
    return successResponse(res, "Author inserted — authors collection created implicitly", data, 201);
}));

router.post("/logs/capped", asyncHandler(async (req, res) => {
    const data = await collectionService.createCappedLogsCollection();
    return successResponse(res, "Capped logs collection created (1MB)", data, 201);
}));
router.post("/books/index", asyncHandler(async (req, res) => {
    const data = await collectionService.createBooksTitleIndex();
    return successResponse(res, "Index created on books.title", data, 201);
}));

export default router;