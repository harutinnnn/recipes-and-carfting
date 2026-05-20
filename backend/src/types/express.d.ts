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
            nextLevelXP: number,
            level: number,
            energy: number,
            avatarUrl: string,
            name: string;
            nickname: string;
            takeEnergyCollect: number;
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