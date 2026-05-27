import {useEffect, useState} from "react";
import {RecipeItemResponseJoin} from "@/api/admin/admin.recipes.api";
import {getRecipesJoin, getRecipesJoinByFactory} from "@/api/recipe.api";

export const RecipesComponent = ({cb,factoryId}: { cb: (recipe: RecipeItemResponseJoin) => void | Promise<void>,factoryId:number }) => {


    const [recipes, setRecipes] = useState<RecipeItemResponseJoin[]>([])


    useEffect(() => {

        (async () => {
            const data = await getRecipesJoinByFactory(factoryId)
            setRecipes(data)
        })()

    }, [setRecipes])

    return (
        <div>
            <h3>Seeds</h3>

            <div className={"user-seeds-list"}>
                {recipes && recipes.map(recipe => {
                    return (
                        <div className={"user-seed recipe-item"} key={recipe.recipe.id}>
                            <img className={"user-seed-icon"} src={import.meta.env.VITE_API_URL + recipe.recipe.icon}
                                 alt=""/>
                            <div className={"user-seed-info"}>{recipe.recipe.title}</div>
                            <div className={"recipe-ingredient-list"}>
                                {recipe.recipesIngredients && recipe.recipesIngredients.map(ingredient => (
                                    <div className={'recipe-ingredient-item'}>
                                        <img src={import.meta.env.VITE_API_URL + ingredient.products.icon} alt=""/>
                                        <div className={"recipe-ingredient-item-title"}>{ingredient.products.title}({ingredient.recipesIngredients.ingredientNeedsCount})</div>
                                    </div>
                                ))}
                            </div>
                            <button className={"btn green sm w-100 mt-10"} onClick={() => cb(recipe)}>
                                Make
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
