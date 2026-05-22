import {useEffect, useState} from "react";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {AddSeedComponent} from "@/pages/admin/seeds/AddSeedComponent";
import {getFoods} from "@/api/admin/admin.foods.api";
import {FoodType} from "@/types/FoodType";
import {AddFoodComponent} from "@/pages/admin/foods/AddFoodComponent";

export const AdminFoods = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [foods, setFoods] = useState<FoodType[]>([]);

    const handleGetSeeds = async () => {
        const seeds = await getFoods()
        setFoods(seeds.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetSeeds();
        })()
    }, [setFoods])


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }

    return (
        <div>
            <h1 className="admin-content-title">Seeds
                <span>Seeds</span>
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
                        <th>icon</th>
                        <th>Price</th>
                        <th>Energy power</th>

                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {foods && foods.map(seed => {
                        return (
                            <tr key={seed.id}>
                                <td>{seed.title}</td>
                                <td>
                                    <img src={import.meta.env.VITE_API_URL + seed.icon} alt=""
                                         className={"img-list-thumbnail"}/>
                                </td>
                                <td>{seed.price}</td>
                                <td>{seed.energyPower} energy</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit" onClick={() => {
                                            setIsOpenModal(!isOpenModal)
                                            setItemId(seed.id);
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
                contend={<AddFoodComponent id={itemId} cb={() => {
                    void handleGetSeeds()
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}