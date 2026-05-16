import dotenv from "dotenv";
import {db} from "./db";
import {createApp} from "./routes/app";
import {AppContext} from "./types/app.context.type";
import {storage} from "./config/storage";
import passport from "./config/passport";

dotenv.config();

const context: AppContext = {
    db: db,
    storage: storage,
}

const app = createApp(context)


const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
