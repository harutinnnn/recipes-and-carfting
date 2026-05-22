import {Router} from 'express';
import {AppContext} from "../types/app.context.type";
import {MarketController} from "../controllers/market.controller";
import {authenticateJWT} from "../middlewares/auth";
import {validateParams} from "../middlewares/validate";
import {QueryParamId} from "../schemas/main.schema";

export const marketRouter = (context: AppContext) => {

    const router = Router();

    const marketController = new MarketController(context);

    router.get(
        "/",
        marketController.index
    )

    router.get(
        "/buy-seed/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        marketController.buySeed
    )

    router.get(
        "/sell-product/:id",
        authenticateJWT,
        validateParams(QueryParamId),
        marketController.sellProduct
    )

    return router
}

