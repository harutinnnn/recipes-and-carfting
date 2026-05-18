import {Router} from 'express';
import {AdminSeedsController} from "../../controllers/admin/admin.seeds.controller";
import {AppContext} from "../../types/app.context.type";
import {authenticateJWT} from "../../middlewares/auth";

export const seedsRouter = (context: AppContext) => {

    const router = Router();

    const adminSeedsController = new AdminSeedsController(context);

    router.get(
        "/",
        authenticateJWT,
        adminSeedsController.index
    );

    return router
}

