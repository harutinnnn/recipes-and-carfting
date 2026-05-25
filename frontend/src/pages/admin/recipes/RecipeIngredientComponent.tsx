import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import React, {useEffect, useState} from "react";
import {IngredientTypes} from "@/types/RecipesType";
import {capitalize} from "@/helpers/text.helper";
import {Trash2} from "lucide-react";
import {getSeeds} from "@/api/admin/admin.seeds.api";
import {SeedType} from "@/types/UserSeedsType";


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
    const [ingredientId, setIngredientId] = useState<number>(addedIngredient?.ingredientId ?? 0);
    const [ingredientNeedsCount, setIngredientNeedsCount] = useState<number>(
        addedIngredient?.ingredientNeedsCount ?? 0
    );

    const [ingredients, setIngredients] = useState<SeedType[]>([]);

    const getIngredientItems = async (type: IngredientTypesEnum) => {

        setIngredients([])
        if (type === IngredientTypesEnum.VEGETABLE) {
            const seeds = await getSeeds();
            setIngredients(seeds.items)
        }
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
        setIngredientId(addedIngredient?.ingredientId ?? 0);
        setIngredientNeedsCount(addedIngredient?.ingredientNeedsCount ?? 0);
    }, [addedIngredient])


    const handleIngredientChanges = (nextValues: Partial<IngredientTypes> = {}) => {
        const nextIngredientType = nextValues.ingredientType ?? ingredientType;
        const nextIngredientId = nextValues.ingredientId ?? ingredientId;
        const nextIngredientNeedsCount = nextValues.ingredientNeedsCount ?? ingredientNeedsCount;

        if (
            Object.values(IngredientTypesEnum).includes(nextIngredientType) && Number(nextIngredientId) > 0 && Number(nextIngredientNeedsCount) > 0
        ) {
            cb({
                id,
                recipeId: recipeId,
                ingredientType: nextIngredientType,
                ingredientId: nextIngredientId,
                ingredientNeedsCount: nextIngredientNeedsCount
            })
        }
    };


    return (

        <div className={"recipe-ingredinet-component"}>


            <Trash2 size={22} onClick={remove} className={"delete-ingredient"}/>


            <div className="input-row">
                <label htmlFor="ingredientType">Factory</label>
                <select name="ingredientType" id={`ingredientType-${id}`} value={ingredientType} onChange={(e) => {
                    if (Object.values(IngredientTypesEnum).includes(e.target.value as IngredientTypesEnum)) {
                        const nextIngredientType = e.target.value as IngredientTypesEnum;
                        setIngredientType(nextIngredientType)
                        setIngredientId(0)
                        handleIngredientChanges({ingredientType: nextIngredientType, ingredientId: 0})
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
                <label htmlFor="ingredientId">Ingredient type</label>

                <div className="ingredient-items-list">
                    {ingredients && ingredients.map(ingredient => {
                        return (
                            <div className={"ingredient-item"} key={ingredient.id}>
                                <div className={"ingredient-item-title"}>{ingredient.title}</div>

                                <label htmlFor={`ingrdient-item-${id}-${ingredient.id}`}>
                                    <input type="radio"
                                           checked={ingredientId === ingredient.id}
                                           id={`ingrdient-item-${id}-${ingredient.id}`} name={`ingredientId-${id}`}
                                           value={ingredient.id} onChange={(e) => {
                                        const nextIngredientId = Number(e.target.value);
                                        setIngredientId(nextIngredientId)
                                        handleIngredientChanges({ingredientId: nextIngredientId})
                                    }}/>
                                    <img src={import.meta.env.VITE_API_URL + ingredient?.productImage} alt=""/>
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
