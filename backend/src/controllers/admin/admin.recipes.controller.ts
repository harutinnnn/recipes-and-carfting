import {Request, Response} from "express";
import {AppContext} from "../../types/app.context.type";
import {products, recipes, recipesIngredients, seeds} from "../../db/schema";
import {asc, eq} from "drizzle-orm";
import {DbTransaction} from "../../types/db.types";
import {removeFile, uploadFile} from "../../helpers/file.helper";
import path from "node:path";
import {IngredientTypes} from "../../types/IngredientTypes";
import {IngredientTypesEnum} from "../../enums/IngredientTypesEnum";

const recipeIngredientTypes = [
    IngredientTypesEnum.VEGETABLE,
    IngredientTypesEnum.ANIMAL_PRODUCT,
    IngredientTypesEnum.MADE_IN_FACTORY,
] as const;

type RecipeIngredientType = (typeof recipeIngredientTypes)[number];

const isRecipeIngredientType = (value: IngredientTypesEnum): value is RecipeIngredientType =>
    recipeIngredientTypes.includes(value as RecipeIngredientType);

export class AdminRecipesController {


    constructor(private context: AppContext) {
    }


    index = async (req: Request, res: Response) => {
        try {

            const items = await this.context.db.select().from(recipes).orderBy(
                asc(recipes.id)
            );

            res.json({
                items: items,
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    getRecipe = async (req: Request, res: Response) => {
        try {

            const {id} = req.params;
            const [item] = await this.context.db.select().from(recipes).where(eq(recipes.id, Number(id)));


            const recipesIngredientItems = await this.context.db.select().from(recipesIngredients).where(
                eq(
                    recipesIngredients.recipeId, Number(id)
                )
            ).innerJoin(products, eq(products.id, recipesIngredients.productId))
                .orderBy(asc(recipesIngredients.id));

            res.json({
                recipe: item,
                recipesIngredients: recipesIngredientItems
            });

        } catch (err) {
            res.status(400).json({message: "Invalid token"});
        }
    }

    editRecipe = async (req: Request, res: Response) => {


        try {

            const {
                id,
                title,
                productId,
                price,
                factoryId,
                availableFromLevel,
                xpOnCollect,
                takeEnergyCollect,
                ingredients
            } = req.body;

            const tmpId = !isNaN(id) ? id : 0;

            await this.context.db.transaction(async (trx: DbTransaction) => {

                const [recipe] = await trx.select().from(recipes).where(eq(recipes.id, parseInt(tmpId)));


                if (recipe?.id) {

                    let iconUrl = recipe.icon;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    if (icon) {

                        const rootDir = process.cwd();
                        if (iconUrl) {
                            await removeFile(path.join(rootDir, iconUrl));
                        }

                        const uploadedIcon = await uploadFile(icon, 'recipes');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }


                    await trx.update(recipes).set({
                        title: title,
                        productId: Number(productId),
                        price: Number(price),
                        factoryId: Number(factoryId),
                        availableFromLevel: Number(availableFromLevel),
                        xpOnCollect: Number(xpOnCollect),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: iconUrl
                    }).where(eq(recipes.id, recipe?.id));

                    if (ingredients && ingredients.length > 0) {
                        await this.saveIngredients(recipe.id, ingredients, trx);
                    }


                    return res.json({
                        recipe: recipe,
                    });

                } else {

                    const [tmpRecipe] = await trx.insert(recipes).values({
                        title: title,
                        productId: Number(productId),
                        price: Number(price),
                        factoryId: Number(factoryId),
                        availableFromLevel: Number(availableFromLevel),
                        xpOnCollect: Number(xpOnCollect),
                        takeEnergyCollect: Number(takeEnergyCollect),
                        icon: "",

                    }).returning({id: recipes.id});
                    const insertId = tmpRecipe?.id;

                    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
                    const icon = files?.icon?.[0];

                    let iconUrl = "";

                    if (icon) {

                        const uploadedIcon = await uploadFile(icon, 'recipes');
                        if (uploadedIcon instanceof Error) {
                            throw uploadedIcon;
                        }
                        iconUrl = uploadedIcon;
                    }

                    if (iconUrl) {

                        await trx.update(recipes).set({
                            icon: iconUrl,
                        }).where(eq(recipes.id, insertId));
                    }
                    if (ingredients && ingredients.length > 0) {
                        await this.saveIngredients(insertId, ingredients, trx);
                    }

                    return res.json({
                        recipe: tmpRecipe,
                    });

                }

            }).catch((err: unknown) => {

                res.status(400).json({message: "Failed to create recipe"});
            })


        } catch (err) {

            res.status(400).json({message: "Invalid token"});
        }
    }

    private saveIngredients = async (recipeId: number, ingredients: IngredientTypes[], trx: DbTransaction) => {

        try {
            const ingredientRows = ingredients.map((ingredient) => {
                const productId = Number(ingredient.productId);
                const ingredientNeedsCount = Number(ingredient.ingredientNeedsCount);

                if (!isRecipeIngredientType(ingredient.ingredientType) || productId <= 0 || ingredientNeedsCount <= 0) {
                    throw new Error('Wrong ingredient values');
                }

                return {
                    recipeId,
                    productId: productId,
                    ingredientType: ingredient.ingredientType,
                    ingredientNeedsCount,
                };
            });

            await trx.delete(recipesIngredients).where(
                eq(recipesIngredients.recipeId, recipeId)
            );

            await trx.insert(recipesIngredients).values(ingredientRows);
        } catch (err) {
            console.log(err)
        }

    }

}
