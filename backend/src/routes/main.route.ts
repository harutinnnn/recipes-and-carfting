import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {MainController} from "../controllers/main.controller";
import {authenticateJWT} from "../middlewares/auth";
import {validate} from "../middlewares/validate";
import {UserSeedSchema} from "../schemas/user.seeds";

export const mainRouter = (context: AppContext) => {

    const router = Router();

    const mainController = new MainController(context);

    router.get(
        "/",
        mainController.index
    );

    router.get(
        "/seeds",
        authenticateJWT,
        mainController.seeds
    );

    router.get(
        "/fields",
        authenticateJWT,
        mainController.fields
    );



    router.get(
        "/user-seeds",
        authenticateJWT,
        mainController.userSeeds
    );


    router.post(
        "/set-user-seed",
        authenticateJWT,
        validate(UserSeedSchema),
        mainController.setUserSeeds
    );

    return router
}

