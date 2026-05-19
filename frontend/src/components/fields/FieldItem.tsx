import { FieldItemTypeJoin} from "@/types/FieldItemType";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {useEffect, useState} from "react";
import {getDateProgressPercentage} from "@/helpers/date.helper";

export const FieldItem = ({field, height}: { field: FieldItemTypeJoin | null, height: number }) => {

    const [currentDate, setCurrentDate] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 1000)
        return () => clearInterval(interval);
    }, [])


    if (field && field.userFields?.seedId === null) {
        return (
            <div className={"field-item empty"} style={{height: `${height - 30}px`}}>
                <div className={"field-seed-new"}>
                    <button className={"btn green rounded"}>Seed</button>
                </div>
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
