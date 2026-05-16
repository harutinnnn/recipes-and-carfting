import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {AuthController} from "../controllers/auth.controller";

export const authRouter = (context: AppContext) => {

    const router = Router();

    const authController = new AuthController(context);

    router.get(
        "/login",
        authController.login
    );

    return router
}

