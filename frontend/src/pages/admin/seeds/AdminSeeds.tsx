import {useEffect, useState} from "react";
import {getSeeds} from "@/api/admin/admin.seeds.api";
import {SeedType} from "@/types/UserSeedsType";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {AddSeedComponent} from "@/pages/admin/seeds/AddSeedComponent";

export const AdminSeeds = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [seeds, setSeeds] = useState<SeedType[]>([]);

    const handleGetSeeds = async () => {
        const seeds = await getSeeds()
        setSeeds(seeds.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetSeeds();
        })()
    }, [setSeeds])


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
                        <th>Available from level</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    {seeds && seeds.map(seed => {
                        return (
                            <tr>
                                <td>{seed.title}</td>
                                <td>
                                    <img src={import.meta.env.VITE_API_URL + seed.icon} alt=""/>
                                </td>
                                <td>{seed.price}</td>
                                <td>{seed.availableLevel}</td>
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

                </table>
            </div>

            <MyModal
                afterOpen={() => {
                    handleCLoseModal();
                }} openModal={isOpenModal}
                closedModal={() => setIsOpenModal(false)}
                contend={<AddSeedComponent id={itemId} cb={() => {
                    void handleGetSeeds()
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}