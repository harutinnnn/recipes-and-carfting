import {useEffect, useState} from "react";
import {RecipeItemResponseJoin} from "@/api/admin/admin.recipes.api";
import {getRecipesJoin} from "@/api/recipe.api";

export const RecipesComponent = ({cb}: { cb: (recipe: RecipeItemResponseJoin) => void | Promise<void> }) => {


    const [recipes, setRecipes] = useState<RecipeItemResponseJoin[]>([])


    useEffect(() => {

        (async () => {
            const data = await getRecipesJoin()
            setRecipes(data)
        })()

    }, [setRecipes])

    return (
        <div>
            <h3>Seeds</h3>

            <div className={"user-seeds-list"}>
                {recipes && recipes.map(recipe => {
                    return (
                        <div className={"user-seed"} key={recipe.recipe.id}>
                            <img className={"user-seed-icon"} src={import.meta.env.VITE_API_URL + recipe.recipe.icon}
                                 alt=""/>
                            <div className={"user-seed-info"}>{recipe.recipe.title}</div>
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
