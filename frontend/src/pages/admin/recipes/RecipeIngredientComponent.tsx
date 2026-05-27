import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import React, {useEffect, useState} from "react";
import {IngredientTypes} from "@/types/RecipesType";
import {capitalize} from "@/helpers/text.helper";
import {Trash2} from "lucide-react";
import {getSeeds} from "@/api/admin/admin.seeds.api";
import {SeedType, SeedTypeProduct} from "@/types/UserSeedsType";
import {getProductsByType} from "@/api/admin/admin.products.api";
import {ProductType} from "@/types/ProductType";


export const RecipeIngredientComponent = ({cb, recipeId, id, remove, addedIngredient}: {
    cb: (ingredient: IngredientTypes) => void,
    recipeId: number,
    id: number,
    remove: () => void,
    addedIngredient?: IngredientTypes
}) => {

    const [ingredientType, setIngredientType] = useState<IngredientTypesEnum>(
        addedIngredient?.ingredientType ?? IngredientTypesEnum.VEGETABLE
    );
    const [productId, setProductId] = useState<number>(addedIngredient?.productId ?? 0);
    const [ingredientNeedsCount, setIngredientNeedsCount] = useState<number>(
        addedIngredient?.ingredientNeedsCount ?? 0
    );

    const [ingredients, setIngredients] = useState<ProductType[]>([]);

    const getIngredientItems = async (type: IngredientTypesEnum) => {

        setIngredients([])

        const seeds = await getProductsByType(type);
        setIngredients(seeds.items)
    }

    const getIngredientByType = async (type: IngredientTypesEnum) => {

        await getIngredientItems(type)
    }


    useEffect(() => {
        (async () => {
            await getIngredientByType(ingredientType)
        })()

    }, [ingredientType])


    useEffect(() => {
        setIngredientType(addedIngredient?.ingredientType ?? IngredientTypesEnum.VEGETABLE);
        setProductId(addedIngredient?.productId ?? 0);
        setIngredientNeedsCount(addedIngredient?.ingredientNeedsCount ?? 0);
    }, [addedIngredient])


    const handleIngredientChanges = (nextValues: Partial<IngredientTypes> = {}) => {
        const nextIngredientType = nextValues.ingredientType ?? ingredientType;
        const nextProductId = nextValues.productId ?? productId;
        const nextIngredientNeedsCount = nextValues.ingredientNeedsCount ?? ingredientNeedsCount;

        if (
            Object.values(IngredientTypesEnum).includes(nextIngredientType) && Number(nextProductId) > 0 && Number(nextIngredientNeedsCount) > 0
        ) {
            cb({
                id,
                recipeId: recipeId,
                ingredientType: nextIngredientType,
                productId: nextProductId,
                ingredientNeedsCount: nextIngredientNeedsCount
            })
        }
    };


    return (

        <div className={"recipe-ingredinet-component"}>


            <Trash2 size={22} onClick={remove} className={"delete-ingredient"}/>


            <div className="input-row">
                <label htmlFor="ingredientType">Factory</label>
                <select name="ingredientType" id={`ingredientType-${id}`} value={ingredientType}
                        onChange={(e) => {
                            if (Object.values(IngredientTypesEnum).includes(e.target.value as IngredientTypesEnum)) {
                                const nextIngredientType = e.target.value as IngredientTypesEnum;
                                setIngredientType(nextIngredientType)
                                setProductId(0)
                                handleIngredientChanges({ingredientType: nextIngredientType, productId: 0})
                            }
                        }}>
                    {Object.values(IngredientTypesEnum).map(ingredientType => {
                        return (
                            <option value={ingredientType}
                                    key={ingredientType}>{capitalize(ingredientType)}</option>
                        )
                    })}
                </select>
            </div>

            <div className="input-row">
                <label htmlFor="productId">Ingredient type</label>

                <div className="ingredient-items-list">
                    {ingredients && ingredients.map(ingredient => {
                        return (
                            <div className={"ingredient-item"} key={ingredient.id}>
                                <div className={"ingredient-item-title"}>{ingredient.title}</div>

                                <label htmlFor={`ingrdient-item-${id}-${ingredient.id}`}>
                                    <input type="radio"
                                           checked={productId === ingredient.id}
                                           id={`ingrdient-item-${id}-${ingredient.id}`} name={`productId-${id}`}
                                           value={ingredient.id} onChange={(e) => {
                                        const nextProductId = Number(e.target.value);
                                        setProductId(nextProductId)
                                        handleIngredientChanges({productId: nextProductId})
                                    }}/>
                                    <img src={import.meta.env.VITE_API_URL + ingredient?.icon} alt=""/>
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>


            <div className="input-row">
                <label htmlFor="ingredientNeedsCount">Ingredient Needs Count</label>
                <input type="number" id={`ingredientNeedsCount-${id}`} name="ingredientNeedsCount"
                       value={ingredientNeedsCount}
                       onChange={(e) => {
                           const nextIngredientNeedsCount = Number(e.target.value);
                           setIngredientNeedsCount(nextIngredientNeedsCount)
                           handleIngredientChanges({ingredientNeedsCount: nextIngredientNeedsCount})
                       }}
                       placeholder="Ingredient Needs Count"/>
            </div>

        </div>
    )
}
