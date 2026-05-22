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
import {getFieldProgressImage} from "@/helpers/field.helper";

export const FieldItem = ({field, height, cb}: { field: FieldItemTypeJoin | null, height: number, cb: () => void }) => {

    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [isOpenModal, setIsOpenModal] = useState(false);
    const {refreshUser} = useAuth();

    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 1000)
        return () => clearInterval(interval);
    }, [])


    const handleGetSeeds = () => {
        setIsOpenModal(true);
    }


    const handleCLoseModal = () => {
        console.log("handleCLoseModal");
    }


    const handleSetSeeds = async (fieldId: number, seedId: number) => {
        const data = await setUserSeed({fieldId: fieldId, seedId: seedId})

        if ("error" in data) {
            toast.error(data.error + '')
        } else {
            setIsOpenModal(false)
            await refreshUser();
            cb()
        }


    }

    if (field && field.userFields?.seedId === null) {
        return (
            <div className={"field-item empty"} style={{height: `${height - 30}px`}}>
                <div className={"field-seed-new"}>
                    <button className={"btn green rounded"} onClick={() => handleGetSeeds()}>Seed</button>
                </div>

                <MyModal
                    afterOpen={() => {
                        handleCLoseModal();
                    }} openModal={isOpenModal}
                    closedModal={() => setIsOpenModal(false)}
                    contend={<UserSeeds cb={async (userSeed: UserSeedTypeJoin) => {
                        await handleSetSeeds(field.userFields.id, userSeed.seeds.id)
                    }}/>}
                />
            </div>
        );
    }

    if (!field) {
        return null;
    }

    let progress = 0;

    if (field.userFields?.startedAt && field.userFields?.finishedAt) {
        progress = getDateProgressPercentage(field.userFields.startedAt, field.userFields.finishedAt, currentDate);
    }
    const isReady = field.userFields?.status === FieldStatusEnum.ready || progress >= 100;

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

            <span className={"field-seed-title"}>{field?.seeds?.title}</span>

            {isReady &&
                <span className={"field-seed-status"}>Ready</span>
            }
            <img src={getFieldProgressImage(field,progress,import.meta.env.VITE_API_URL)} alt="" className={"field-item-icon"}/>

            <div className={"field-item-info"}>


                <span className={'field-seed-progress'}
                      style={{width: `${progress}%`}}></span>
            </div>
            {isReady &&
                <div className={"field-collect"}>
                    <button className={"btn green rounded"} onClick={async () => {
                        await collectFromField(field)
                        cb()
                    }}> Click to collect
                    </button>
                </div>
            }
        </div>
    )
}
