import {z} from "zod";
import {Gender} from "../enums/Gender";

export const UserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    nickname: z.string().min(1, "Nickname is required"),
    email: z.email("Invalid email address"),
    gender: z.enum(Gender),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ForgotSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const TokenParamSchema = z.object({
    token: z.string(),
});


export const UpdateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    nickname: z.string().min(1, "Nickname is required"),
    gender: z.enum(Gender),
});