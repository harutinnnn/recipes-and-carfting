import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    serial,
    uniqueIndex,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import {number} from "zod";
import {relations} from "drizzle-orm/relations";

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

export const users = pgTable("users", {
    id: integer("id").primaryKey(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    gameMoney: integer("gameMoney").default(0),
    realMoney: integer("realMoney").default(0),
    xp: integer("xp").default(0),
    level: integer("level").default(1),
    googleId: text("google_id").notNull().unique(),
    avatarUrl: text("avatar_url"),
    isAdmin: boolean("is_admin").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});


export const seeds = pgTable("seeds", {
    id: serial("id").primaryKey(),
    title: text("title").notNull().unique(),
    price: integer("price").default(0),
    givesExperience: integer("givesExperience").default(0),
    availableLevel: integer("availableLevel").default(1),
});


export const userSeeds = pgTable("userSeeds", {
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    seedId: integer("seedId").notNull()
        .references(() => seeds.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    count: integer("count").default(0),
});


/* Relations */
export const userSeedsRelation = relations(users,
    ({many}) => (
        {
            seeds: many(seeds)
        }
    ))






