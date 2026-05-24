import {useEffect, useState} from "react";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {AddFactoryComponent} from "@/pages/admin/factories/AddFactoryComponent";
import {getFactories} from "@/api/admin/admin.factories.api";
import {FactoryType} from "@/types/FactoryType";

export const AdminFactories = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [factories, setFactories] = useState<FactoryType[]>([]);

    const handleGetFactories = async () => {
        const data = await getFactories();
        setFactories(data.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetFactories();
        })()
    }, [setFactories])


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
                    {factories && factories.map(factory => {
                        return (
                            <tr key={factory.id}>
                                <td>{factory.title}</td>
                                <td>
                                    <img src={import.meta.env.VITE_API_URL + factory.icon} alt=""
                                         className={"img-list-thumbnail"}/>
                                </td>
                                <td>{factory.price}</td>
                                <td>{factory.availableFromLevel}</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit" onClick={() => {
                                            setIsOpenModal(!isOpenModal)
                                            setItemId(factory?.id || 0);
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
                contend={<AddFactoryComponent id={itemId} cb={() => {
                    void handleGetFactories()
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}