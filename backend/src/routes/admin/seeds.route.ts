import {NextFunction, Request, Response, Router} from 'express';
import {AdminSeedsController} from "../../controllers/admin/admin.seeds.controller";
import {AppContext} from "../../types/app.context.type";
import {authenticateJWT} from "../../middlewares/auth";
import multer from "multer";
import {storage} from "../../config/storage";
import {validate} from "../../middlewares/validate";
import {SeedsSchema} from "../../schemas/user.seeds";
import {checkIsAdmin} from "../../utils/admin/admin.utilities";

const MAX_FILE_SIZE_MB = 2;

const iconUploader = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    },
});

const uploadSeedImages = iconUploader.fields([
    {name: 'icon', maxCount: 1},
    {name: 'productImage', maxCount: 1}
]);

const handleSeedImageUpload = (req: Request, res: Response, next: NextFunction) => {
    uploadSeedImages(req, res, (err: unknown) => {
        if (!err) {
            return next();
        }

        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    message: `File is too large. Max file size is ${MAX_FILE_SIZE_MB}MB`,
                });
            }

            return res.status(400).json({
                message: err.message,
            });
        }

        return res.status(500).json({
            message: "Failed to upload file",
        });
    });
};


export const seedsRouter = (context: AppContext) => {

    const router = Router();

    const adminSeedsController = new AdminSeedsController(context);

    router.get(
        "/",
        authenticateJWT,
        checkIsAdmin
    );

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
        authenticateJWT,
        handleSeedImageUpload,
        validate(SeedsSchema),
        adminSeedsController.editSeed
    );

    return router
}

