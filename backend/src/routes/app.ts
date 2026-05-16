import cors from "cors";
import express from "express";
import passport from "../config/passport";
import {AppContext} from "../types/app.context.type";
import path from "node:path";
import * as http from "node:http";
import {mainRouter} from "./main.route";

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

    return http.createServer(app);

}
