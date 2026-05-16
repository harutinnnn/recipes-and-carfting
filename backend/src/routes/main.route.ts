import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {MainController} from "../controllers/main.controller";

export const mainRouter = (context: AppContext) => {

    const router = Router();

    const mainController = new MainController(context);

    router.get(
        "/",
        mainController.index
    );

    return router
}

