import {useEffect, useState} from "react";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {RecipesType} from "@/types/RecipesType";
import {getRecipes} from "@/api/admin/admin.recipes.api";
import {AddRecipeComponent} from "@/pages/admin/recipes/AddRecipeComponent";

export const AdminRecipes = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [recipes, setRecipes] = useState<RecipesType[]>([]);

    const handleGetRecipes = async () => {
        const data = await getRecipes();
        setRecipes(data.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetRecipes();
        })()
    }, [setRecipes])


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }

    return (
        <div>
            <h1 className="admin-content-title">
                <span>Factories</span>
                <button className={"btn info sm right-side"} onClick={() => {
                    setIsOpenModal(!isOpenModal)
                    setItemId(0);
                }}>Add
                </button>
            </h1>


            <div className={"items-list"}>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Available From Level</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {recipes && recipes.map(recipe => {
                        return (
                            <tr key={recipe.id}>
                                <td>{recipe.title}</td>
                                <td>
                                    <img src={import.meta.env.VITE_API_URL + recipe.icon} alt=""
                                         className={"img-list-thumbnail"}/>
                                </td>
                                <td>{recipe.price}</td>
                                <td>{recipe.availableFromLevel}</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit" onClick={() => {
                                            setIsOpenModal(!isOpenModal)
                                            setItemId(recipe?.id || 0);
                                        }}/>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>

                </table>
            </div>

            <MyModal
                afterOpen={() => {
                    handleCLoseModal();
                }} openModal={isOpenModal}
                closedModal={() => setIsOpenModal(false)}
                contend={<AddRecipeComponent id={itemId} cb={() => {
                    void handleGetRecipes();
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}