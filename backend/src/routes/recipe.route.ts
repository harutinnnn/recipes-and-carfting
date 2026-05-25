import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {authenticateJWT} from "../middlewares/auth";
import {validateParams} from "../middlewares/validate";
import {QueryParamId} from "../schemas/main.schema";
import {RecipeController} from "../controllers/recipe.controller";

export const recipeRouter = (context: AppContext) => {

    const router = Router();

    const recipeController = new RecipeController(context);

    router.get(
        "/",
        recipeController.index
    )

    router.get(
        "/buy-seed/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.buySeed
    )

    router.get(
        "/buy-food/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.buyFood
    )

    router.get(
        "/sell-product/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.sellProduct
    )

    router.get(
        "/sell-product-all/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.sellProductAll
    )

    router.get(
        "/use-food/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.useFood
    )

    router.get(
        "/buy-factory/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        recipeController.buyFactory
    )

    return router
}

