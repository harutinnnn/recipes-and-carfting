import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    serial,
    uniqueIndex,
    unique,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import {number} from "zod";
import {relations} from "drizzle-orm/relations";
import {Statuses} from "../enums/Statuses";
import {FieldStatusEnum} from "../enums/FieldStatusEnum";
import {IngredientTypesEnum} from "../enums/IngredientTypesEnum";

export const itemCategory = pgEnum("item_category", [
    "seed",
    "crop",
    "food",
    "animal",
    "animal_product",
    "material",
    "tool",
    "clothing"
]);

export const buildingType = pgEnum("building_type", [
    "bakery",
    "restaurant",
    "factory",
    "barn",
    "field"
]);


export const userStatus = pgEnum("status", [Statuses.PENDING, Statuses.PUBLISHED, Statuses.BLOCKED, Statuses.NOT_ACTIVATED]);


export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    gameMoney: integer("gameMoney").default(0),
    realMoney: integer("realMoney").default(0),
    xp: integer("xp").default(0),
    level: integer("level").default(1),
    googleId: text("google_id").unique(),
    avatarUrl: text("avatar_url"),
    status: userStatus('status',).notNull().default(Statuses.NOT_ACTIVATED),
    isAdmin: boolean("is_admin").default(false).notNull(),
    activationToken: text("activationToken"),
    refreshToken: text("refreshToken"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull()
});


export const seeds = pgTable("seeds", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").default(0),
    img: text("img").notNull(),
    givesExperience: integer("givesExperience").default(0),
    availableLevel: integer("availableLevel").default(1),
    xpOnCollect: integer("xpOnCollect").default(0),
});

export const userSeeds = pgTable("userSeeds", {
    id: serial("id").primaryKey(),
    userId: serial("userId").notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    seedId: serial("seedId").notNull()
        .references(() => seeds.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    count: integer("count").default(0),
});

export const userSeedsRelation = relations(users,
    ({many}) => (
        {
            seeds: many(seeds)
        }
    ))


export const fieldStatus = pgEnum("status", FieldStatusEnum);

export const userFields = pgTable("userFields", {
    id: serial("id").primaryKey(),
    userId: serial("userId").notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    seedId: integer("seedId")
        .references(() => seeds.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    status: fieldStatus('status').notNull().default(FieldStatusEnum.pending),
});


export const factories = pgTable("factories", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").notNull(),
    img: text("img").notNull(),
    availableFromLevel: integer("availableFromLevel").default(1),
});

export const recipes = pgTable("recipes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").default(0),
    img: text("img").notNull(),
    availableFromLevel: integer("availableFromLevel").default(1),
    xpOnCollect: integer("xpOnCollect").default(0),
});

export const ingredientType = pgEnum("ingredientType", IngredientTypesEnum);

export const recipesIngredients = pgTable("recipesIngredients", {
        id: serial("id").primaryKey(),
        recipesId: integer("recipesId")
            .references(() => recipes.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        ingredientId: integer("ingredientId").notNull(),
        ingredientType: ingredientType('ingredientType').notNull(),
        ingredientNeeds: integer("ingredientNeeds").notNull(),
        price: integer("price").default(0),
        img: text("img").notNull(),
        availableFromLevel: integer("availableFromLevel").default(1),
        xpOnCollect: integer("xpOnCollect").default(0),
    },
    (table) => [
        unique("skills_name_company_unique").on(
            table.recipesId,
            table.ingredientId
        ),
    ]);


export const recipesIngredientsRelation = relations(recipes,
    ({many}) => (
        {
            ingredients: many(recipesIngredients)
        }
    ))