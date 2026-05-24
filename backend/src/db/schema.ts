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
    uuid, numeric
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
    name: text("name").notNull(),
    nickname: text("nickname").notNull(),
    gameMoney: numeric("gameMoney", {
        precision: 10,
        scale: 2,
    }).notNull().default("0"),
    realMoney: integer("realMoney").default(0),
    xp: integer("xp").default(0),
    nextLevelXP: integer("nextLevelXP").default(0),
    level: integer("level").default(1),
    energy: integer("energy").default(100),
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
    price: numeric("price", {
        precision: 10,
        scale: 2,
    }).notNull().default("0"),
    minSellPrice: numeric("minSellPrice", {
        precision: 10,
        scale: 2,
    }).notNull().default("0"),
    icon: text("icon"),
    productImage: text("productImage"),
    readyProductImage: text("readyProductImage"),
    availableLevel: integer("availableLevel").default(1),
    xpOnCollect: integer("xpOnCollect").default(0),
    takeEnergyCollect: integer("takeEnergyCollect").default(0),
    collectionTime: integer("collection_time").default(0),
});

export const seedsProgressImages = pgTable("seedsProgressImages", {
    id: serial("id").primaryKey(),
    seedId: serial("seedId").notNull()
        .references(() => seeds.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    icon: text("icon"),
    pos: integer("pos").default(0),
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


export const fieldStatus = pgEnum("fieldStatus", [
    FieldStatusEnum.pending,
    FieldStatusEnum.in_progress,
    FieldStatusEnum.ready,
]);

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
    status: fieldStatus('fieldStatus').notNull().default(FieldStatusEnum.pending),
    startedAt: timestamp("started_at"),
    finishedAt: timestamp("finished_at"),
});


export const factories = pgTable("factories", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").notNull(),
    icon: text("icon").notNull(),
    availableFromLevel: integer("availableFromLevel").default(1),
});


export const userFactories = pgTable("userFactories", {
    id: serial("id").primaryKey(),
    userId: serial("userId").notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    factoryId: integer("factoryId")
        .references(() => factories.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    recipeId: integer("recipeId")
        .references(() => recipes.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    status: fieldStatus('fieldStatus').notNull().default(FieldStatusEnum.pending),
    startedAt: timestamp("started_at"),
    finishedAt: timestamp("finished_at"),
});

export const recipes = pgTable("recipes", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").default(0),
    factoryId: serial("factoryId").notNull()
        .references(() => factories.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    icon: text("icon").notNull(),
    availableFromLevel: integer("availableFromLevel").default(1),
    xpOnCollect: integer("xpOnCollect").default(0),
    takeEnergyCollect: integer("takeEnergyCollect").default(0),
});


export const ingredientType = pgEnum("ingredientType", [IngredientTypesEnum.VEGETABLE, IngredientTypesEnum.ANIMAL_PRODUCT, IngredientTypesEnum.MADE_IN_FACTORY]);

export const recipesIngredients = pgTable("recipesIngredients", {
        id: serial("id").primaryKey(),
        recipeId: integer("recipeId")
            .references(() => recipes.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
        ingredientId: integer("ingredientId").notNull(),
        ingredientType: ingredientType('ingredientType').notNull(),
        ingredientNeedsCount: integer("ingredientNeedsCount").notNull()
    },
    (table) => [
        unique("skills_name_company_unique").on(
            table.recipeId,
            table.ingredientId
        ),
    ]);


export const recipesIngredientsRelation = relations(recipes,
    ({many}) => (
        {
            ingredients: many(recipesIngredients)
        }
    ))


export const userProductTypes = pgEnum("userProductTypes", [IngredientTypesEnum.ANIMAL_PRODUCT, IngredientTypesEnum.MADE_IN_FACTORY, IngredientTypesEnum.VEGETABLE]);

export const userProducts = pgTable("userProducts", {
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
    count: integer("count").default(0),
    userProductTypes: userProductTypes('userProductTypes').notNull()
});


export const gameProducts = pgTable("gameProducts", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: numeric("price", {
        precision: 10,
        scale: 2,
    }).notNull().default("0"),
    icon: text("icon"),
    availableLevel: integer("availableLevel").default(1),
});


export const foods = pgTable("foods", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    price: numeric("price", {
        precision: 10,
        scale: 2,
    }).notNull().default("0"),
    energyPower: integer("energyPower").default(0),
    icon: text("icon")
});

export const userFoods = pgTable("userFoods", {
    id: serial("id").primaryKey(),
    userId: serial("userId").notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    foodId: serial("foodId").notNull()
        .references(() => foods.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    count: integer("count").default(0),
});


export const settings = pgTable("settings", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
});
