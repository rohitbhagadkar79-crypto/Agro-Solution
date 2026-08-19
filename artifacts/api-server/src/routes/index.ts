import { Router, type IRouter } from "express";
import healthRouter from "./health";
import agroRouter from "./agro";

const router: IRouter = Router();

router.use(healthRouter);
router.use(agroRouter);

export default router;
