import {Router} from 'express';
import {AppContext} from "../../types/app.context.type";
import {authenticateJWT} from "../../middlewares/auth";
import {validate} from "../../middlewares/validate";
import {checkIsAdmin} from "../../utils/admin/admin.utilities";
import {FoodSchema, SettingsSchema} from "../../schemas/food.schema";
import {AdminSettingsController} from "../../controllers/admin/admin.settings.controller";


export const settingRouter = (context: AppContext) => {

    const router = Router();

    const adminSettingsController = new AdminSettingsController(context);

    router.get(
        "/",
        authenticateJWT,
        checkIsAdmin
    );

    router.get(
        "/",
        authenticateJWT,
        adminSettingsController.index
    );


    router.get(
        "/:id",
        authenticateJWT,
        adminSettingsController.getSetting
    );


    router.post(
        "/edit",
        authenticateJWT,
        validate(SettingsSchema),
        adminSettingsController.editSetting
    );

    return router
}

