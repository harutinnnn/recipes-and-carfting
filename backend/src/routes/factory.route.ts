import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {FactoryController} from "../controllers/factory.controller";
import {authenticateJWT} from "../middlewares/auth";
import {validateParams} from "../middlewares/validate";
import {QueryParamId} from "../schemas/main.schema";

export const factoryRouter = (context: AppContext) => {

    const router = Router();

    const factoryController = new FactoryController(context);

    router.get(
        "/",
        factoryController.index
    )


    router.get(
        "/buy-seed/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        factoryController.buyFactory
    )

    return router
}

