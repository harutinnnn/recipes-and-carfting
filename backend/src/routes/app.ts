import cors from "cors";
import express from "express";
import passport from "../config/passport";
import {AppContext} from "../types/app.context.type";
import path from "node:path";
import * as http from "node:http";
import {mainRouter} from "./main.route";
import {authRouter} from "./auth.route";
import {seedsRouter} from "./admin/seeds.route";
import {marketRouter} from "./market.route";
import {foodRouter} from "./admin/food.route";
import {settingRouter} from "./admin/settings.route";
import {factoriesRouter} from "./admin/factories.route";
import {recipesRouter} from "./admin/recipes.route";
import {recipeRouter} from "./recipe.route";
import {productRouter} from "./admin/product.route";

export const createApp = (context: AppContext) => {

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(passport.initialize());
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    app.use(cors());
    app.use(express.json());

    app.use(passport.initialize());

    app.use('/api', mainRouter(context));
    app.use('/api/auth', authRouter(context));
    app.use('/api/market', marketRouter(context));
    app.use('/api/recipes', recipeRouter(context));


    // Admin
    app.use('/api/admin/seeds', seedsRouter(context));
    app.use('/api/admin/foods', foodRouter(context));
    app.use('/api/admin/settings', settingRouter(context));
    app.use('/api/admin/factories', factoriesRouter(context));
    app.use('/api/admin/recipes', recipesRouter(context));
    app.use('/api/admin/products', productRouter(context));


    return http.createServer(app);

}
