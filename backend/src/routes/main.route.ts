import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {MainController} from "../controllers/main.controller";
import {authenticateJWT} from "../middlewares/auth";

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

    return router
}

