import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {AuthController} from "../controllers/auth.controller";
import {validate, validateParams} from "../middlewares/validate";
import {ForgotSchema, LoginSchema, TokenParamSchema, UpdateUserSchema, UserSchema} from "../schemas/user.schema";
import {authenticateJWT} from "../middlewares/auth";

export const authRouter = (context: AppContext) => {

    const router = Router();

    const authController = new AuthController(context);

    router.post(
        "/login",
        validate(LoginSchema),
        authController.login
    );
    router.post(
        "/register",
        validate(UserSchema),
        authController.register
    );

    router.post(
        "/forgot",
        validate(ForgotSchema),
        authController.forgot
    );

    router.get(
        "/activation/:token",
        validateParams(TokenParamSchema),
        authController.activate
    );

    router.get(
        "/me",
        authenticateJWT,
        authController.authMe
    );

    router.post(
        "/me",
        validate(UpdateUserSchema),
        authenticateJWT,
        authController.updateMe
    );

    return router
}

