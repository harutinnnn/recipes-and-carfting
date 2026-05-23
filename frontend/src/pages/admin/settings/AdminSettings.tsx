import {useEffect, useState} from "react";
import {PencilLine, Trash2} from "lucide-react";
import {MyModal} from "@/components/admin/MyModal";
import {AddSettingComponent} from "@/pages/admin/settings/AddSettingComponent";
import {getSettings} from "@/api/admin/admin.settings.api";
import {SettingType} from "@/types/SettingsType";

export const AdminSettings = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [itemId, setItemId] = useState<number>(0);

    const [settings, setSettings] = useState<SettingType[]>([]);

    const handleGetSeeds = async () => {
        const data = await getSettings()
        setSettings(data.items)
    }

    useEffect(() => {
        (async () => {
            await handleGetSeeds();
        })()
    }, [setSettings])


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }

    return (
        <div>
            <h1 className="admin-content-title">
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
                        <th>Key</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {settings && settings.map(setting => {
                        return (
                            <tr key={setting.id}>
                                <td>{setting.title}</td>

                                <td>{setting.key}</td>
                                <td>{setting.value}</td>
                                <td>
                                    <div className="quick-actions">
                                        <Trash2 size={22} className="delete"/>
                                        <PencilLine size={22} className="edit" onClick={() => {
                                            setIsOpenModal(!isOpenModal)
                                            setItemId(setting?.id || 0);
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
                contend={<AddSettingComponent id={itemId} cb={() => {
                    void handleGetSeeds()
                    setIsOpenModal(false)
                }}/>}
            />
        </div>
    )
}