import {NextFunction, Request, Response, Router} from 'express';
import {AppContext} from "../../types/app.context.type";
import {authenticateJWT} from "../../middlewares/auth";
import {validate} from "../../middlewares/validate";
import {checkIsAdmin} from "../../utils/admin/admin.utilities";
import {FactorySchema} from "../../schemas/food.schema";
import {AdminFactoriesController} from "../../controllers/admin/admin.factories.controller";
import multer from "multer";
import {storage} from "../../config/storage";

const MAX_FILE_SIZE_MB = 2;

const iconUploader = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    },
});

const uploadFactoryImages = iconUploader.fields([
    {name: 'icon', maxCount: 1},
]);

const handleFactoryImageUpload = (req: Request, res: Response, next: NextFunction) => {
    uploadFactoryImages(req, res, (err: unknown) => {
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


export const factoriesRouter = (context: AppContext) => {

    const router = Router();

    const adminFactoriesController = new AdminFactoriesController(context);

    router.get(
        "/",
        authenticateJWT,
        checkIsAdmin
    );

    router.get(
        "/",
        authenticateJWT,
        adminFactoriesController.index
    );


    router.get(
        "/:id",
        authenticateJWT,
        adminFactoriesController.getFactory
    );


    router.post(
        "/edit",
        authenticateJWT,
        handleFactoryImageUpload,
        validate(FactorySchema),
        adminFactoriesController.editFactory
    );

    return router
}

