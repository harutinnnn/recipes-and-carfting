import {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";
import {Gender} from "../enums/Gender";
import {userFields, users} from "../db/schema";
import {Statuses} from "../enums/Statuses";
import {eq} from "drizzle-orm";
import jwt from "jsonwebtoken";
import {mailService} from "../modules/mail/mail.service";
import {newMemberTemplate} from "../modules/mail/templates/newMember.template";
import {AppContext} from "../types/app.context.type";
import {UserSchema} from "../schemas/user.schema";
import {db} from "../db";
import {FieldStatusEnum} from "../enums/FieldStatusEnum";

type DB = typeof db;

type RegisterValidateDataType = {
    name: string,
    nickname: string,
    email: string,
    gender: Gender,
    password: string,
}

export class AuthService {

    constructor(private db: DB) {

    }

    register = async (req: Request, res: Response): Promise<any> => {

        try {

            const validatedData = UserSchema.parse(req.body);

            const [existingUser] = await db.select().from(users).where(eq(users.email, validatedData.email));
            if (existingUser) {
                return res.status(201).json({error: "User with this email already exists"});
            }


            this.db.transaction(async (trx: any) => {

                const hashedPassword = await bcrypt.hash(validatedData.password, 10);
                const activationHash = randomUUID();


                await trx.insert(users).values({
                    name: validatedData.name,
                    nickname: validatedData.nickname,
                    email: validatedData.email,
                    gender: validatedData.gender,
                    password: hashedPassword,
                    status: Statuses.NOT_ACTIVATED,
                    activationToken: activationHash,
                    gameMoney: process.env.DEFF_USER_MONEY,
                    realMoney: 0,
                    level: 1,
                    xp: 0,
                });

                const [newUser] = await trx.select().from(users).where(eq(users.email, validatedData.email));

                const maxRows: number = Number(process.env.DEFF_USER_FIELDS || 1);
                const fieldRows = [];


                console.log('maxRows', maxRows)

                for (let i = 0; i < maxRows; i++) {

                    fieldRows.push(
                        await trx.insert(userFields)
                            .values({
                                userId: newUser.id,
                                status: FieldStatusEnum.pending
                            })
                    )
                }

                await Promise.all(fieldRows);


                const payload = {id: newUser.id, email: newUser.email};
                const token = jwt.sign(payload, process.env.JWT_SECRET || "default_super_secret_key", {expiresIn: "15m"});
                const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "default_refresh_secret", {expiresIn: "7d"});

                // Save refresh token to db
                await trx.update(users).set({refreshToken}).where(eq(users.id, newUser.id));


                const activationLink = process.env.API_URL + '/api/auth/activation/' + activationHash;
                //Send email activation
                await mailService.sendMail({
                    to: validatedData.email,
                    subject: "Activation mail",
                    html: newMemberTemplate(validatedData.name, activationLink),
                });


                res.status(200).json({
                    token,
                    refreshToken,
                    user: {id: newUser.id, name: newUser.name, email: newUser.email}
                });

            }).catch((err: any) => {
                console.log(err)
                return new Error("Failed to register user")
            })

        } catch (error) {
            return new Error("Failed to register user")
        }

    }

}