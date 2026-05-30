import {NextFunction, Request, Response, Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {AuthController} from "../controllers/auth.controller";
import {validate, validateParams} from "../middlewares/validate";
import {ForgotSchema, LoginSchema, TokenParamSchema, UpdateUserSchema, UserSchema} from "../schemas/user.schema";
import {authenticateJWT} from "../middlewares/auth";
import multer from "multer";
import {storage} from "../config/storage";

const MAX_FILE_SIZE_MB = 2;

const avatarUploader = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    },
});

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
        avatarUploader.single("avatar"),
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

