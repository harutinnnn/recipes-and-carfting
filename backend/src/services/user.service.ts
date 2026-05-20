import {db} from "../db";

export class UserService {

    constructor() {
    }

    userUpToNextLvlByPercent = (level: number): number => {
        return Math.floor(Number(process.env.BASE_XP) * Math.pow(level, Number(process.env.GROWTH)));
    };
}