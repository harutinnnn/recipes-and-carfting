import {FieldItemTypeJoin} from "@/types/FieldItemType";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {useEffect, useState} from "react";
import {getDateProgressPercentage} from "@/helpers/date.helper";
import {AddSeedComponent} from "@/pages/admin/seeds/AddSeedComponent";
import {MyModal} from "@/components/admin/MyModal";
import {UserSeeds} from "@/components/fields/UserSeedsComponent";
import {UserSeedTypeJoin} from "@/types/UserSeedsType";
import {setUserSeed} from "@/api/user.api";

export const FieldItem = ({field, height}: { field: FieldItemTypeJoin | null, height: number }) => {

    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [isOpenModal, setIsOpenModal] = useState(false);

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

        const data = await setUserSeed({
            fieldId: fieldId, seedId: seedId,
        })

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
                        setIsOpenModal(false)
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

    return (
        <div className={"field-item"} style={{height: `${height - 30}px`}}>
            <img src={import.meta.env.VITE_API_URL + field?.seeds?.productImage} alt="" className={"field-item-icon"}/>
            <div className={"field-item-info"}>
                <span className={"field-seed-title"}>{field?.seeds?.title}</span>
                {isReady &&
                    <span className={"field-seed-status"}>Ready</span>
                }
                <span className={'field-seed-progress'}
                      style={{width: `${progress}%`}}></span>
            </div>
            {isReady &&
                <div className={"field-collect"}>
                    <button className={"btn green rounded"}> Click to collect</button>
                </div>
            }
        </div>
    )
}
