import { Router } from "express";
import * as logService from "./log.service.js";
import { successResponse } from "../../common/res/index.js";

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Req 7 — POST /logs
router.post("/", asyncHandler(async (req, res) => {
    const data = await logService.insertLog(req.body);
    return successResponse(res, "Log inserted successfully", data, 201);
}));

export default router;