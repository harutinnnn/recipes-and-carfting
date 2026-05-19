import {Router} from 'express';
import {AdminSeedsController} from "../../controllers/admin/admin.seeds.controller";
import {AppContext} from "../../types/app.context.type";
import {authenticateJWT} from "../../middlewares/auth";
import multer from "multer";
import {storage} from "../../config/storage";
import {validate} from "../../middlewares/validate";
import {SeedsSchema} from "../../schemas/user.seeds";

const iconUploader = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 5MB
    },
});


export const seedsRouter = (context: AppContext) => {

    const router = Router();

    const adminSeedsController = new AdminSeedsController(context);

    router.get(
        "/",
        authenticateJWT,
        adminSeedsController.index
    );


    router.get(
        "/:id",
        authenticateJWT,
        adminSeedsController.getSeed
    );


    router.post(
        "/edit",
        iconUploader.single('icon'),
        authenticateJWT,
        validate(SeedsSchema),
        adminSeedsController.editSeed
    );

    return router
}

