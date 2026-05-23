import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {MainController} from "../controllers/main.controller";
import {authenticateJWT} from "../middlewares/auth";
import {validate, validateParams} from "../middlewares/validate";
import {UserSeedSchema} from "../schemas/user.seeds";
import {QueryParamId} from "../schemas/main.schema";

export const mainRouter = (context: AppContext) => {

    const router = Router();

    const mainController = new MainController(context);

    router.get(
        "/",
        mainController.index
    );

    router.get(
        "/field-price",
        mainController.fieldPrice
    );
    router.get(
        "/buy-new-field",
        authenticateJWT,
        mainController.buyNewField
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

    router.get(
        "/user-products",
        authenticateJWT,
        mainController.userProducts
    );


    router.get(
        "/user-foods",
        authenticateJWT,
        mainController.userFoods
    );


    router.post(
        "/set-user-seed",
        authenticateJWT,
        validate(UserSeedSchema),
        mainController.setUserSeeds
    );

    router.get(
        "/collect-user-field/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        mainController.collectUserField
    );

    return router
}

