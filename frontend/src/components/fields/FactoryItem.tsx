import {FieldItemTypeJoin} from "@/types/FieldItemType";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {useEffect, useState} from "react";
import {getDateProgressPercentage} from "@/helpers/date.helper";
import {MyModal} from "@/components/admin/MyModal";
import {UserSeeds} from "@/components/fields/UserSeedsComponent";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {collectUserField, setUserSeed} from "@/api/user.api";
import {useAuth} from "@/hooks/useAuth";
import toast from "react-hot-toast";
import {FactoryItemTypeJoin} from "@/types/FactoryType";
import {RecipeItemResponseJoin} from "@/api/admin/admin.recipes.api";
import {RecipesComponent} from "@/components/fields/RecipesComponent";
import {setMakeRecipe} from "@/api/recipe.api";

export const FactoryItem = ({factory, height, cb}: {
    factory: FactoryItemTypeJoin | null,
    height: number,
    cb: () => void
}) => {

    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [isOpenModal, setIsOpenModal] = useState(false);
    const {refreshUser} = useAuth();

    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 1000)
        return () => clearInterval(interval);
    }, [])


    const handleGetRecipes = () => {
        setIsOpenModal(true);
    }


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }


    const handleMakeRecipe = async (factoryId: number, recipeId: number) => {
        const data = await setMakeRecipe({seedId: recipeId, factory: factoryId});

        if ("error" in data) {
            toast.error(data.error + '')
        } else {
            setIsOpenModal(false)
            await refreshUser();
            cb()
        }


    }

    if (factory && factory.userFactories?.recipeId === null) {
        return (

            <div className={"field-item"} style={{height: `${height - 30}px`}}>
                <div className={"field-seed-new"}>
                    <button className={"btn green rounded sm"} onClick={() => handleGetRecipes()}>Make</button>
                </div>

                <img src={import.meta.env.VITE_API_URL + factory.factories.icon} alt="" className={"field-item-icon"}/>

                {/*TODO change User seeds to recipes or products*/}
                <MyModal
                    afterOpen={() => {
                        handleCLoseModal();
                    }} openModal={isOpenModal}
                    closedModal={() => setIsOpenModal(false)}
                    contend={<RecipesComponent cb={async (recipe: RecipeItemResponseJoin) => {
                        await handleMakeRecipe(factory.factories.id, recipe.recipe.id)
                    }} factoryId={factory.factories.id}/>}
                />
            </div>
        );
    }

    if (!factory) {
        return null;
    }

    let progress = 0;

    if (factory.userFactories?.startedAt && factory.userFactories?.finishedAt) {
        progress = getDateProgressPercentage(factory.userFactories.startedAt, factory.userFactories.finishedAt, currentDate);
    }
    const isReady = factory.userFactories?.status === FieldStatusEnum.ready || progress >= 100;

    const collectFromField = async (field: FieldItemTypeJoin) => {

        const data = await collectUserField(field.userFields.id);

        if ("error" in data) {
            console.log(data)
            toast.error(data?.error + "")
        }

        await refreshUser();

    }

    return (
        <div className={"field-item"} style={{height: `${height - 30}px`}}>

            <span className={"field-seed-title"}>{factory.factories?.title}</span>

            {isReady &&
                <span className={"field-seed-status"}>Ready</span>
            }
            <img src={import.meta.env.VITE_API_URL + factory.factories.icon} alt="" className={"field-item-icon"}/>

            <div className={"field-item-info"}>


                <span className={'field-seed-progress'}
                      style={{width: `${progress}%`}}></span>
            </div>
            {isReady &&
                <div className={"field-collect"}>
                    <button className={"btn green rounded sm"} onClick={async () => {
                        // await collectFromField(field)
                        cb()
                    }}> Collect
                    </button>
                </div>
            }
        </div>
    )
}
