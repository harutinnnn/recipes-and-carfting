import {Multer} from "multer";

export {}; // 👈 required

global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User {
            id: number;
            email: string;
            isAdmin:boolean,
            gameMoney: number,
            realMoney: number,
            xp: number,
            level: number,
            avatarUrl: string,
            name: string;
            nickname: string;
        }

        interface Request {
            user?: User | undefined;
            file?: Multer.File
            files?:
                | {
                [fieldname: string]: Multer.File[];
            }
                | Multer.File[]
                | undefined;
        }
    }
}