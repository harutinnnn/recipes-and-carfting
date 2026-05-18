import {FieldItemType} from "@/types/FieldItemType";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {useEffect, useState} from "react";
import {getDateProgressPercentage} from "@/helpers/date.helper";

export const FieldItem = ({field, height}: { field: FieldItemType | null, height: number }) => {

    const [currentDate, setCurrentDate] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentDate(new Date()), 1000)
        return () => clearInterval(interval);
    }, [])


    if (field === null) {
        return (
            <div className={"field-item empty"}>
                <div className={"field-seed-new"}>
                    <button className={"btn green"}>Seed</button>
                </div>
            </div>
        );
    }

    const progress = getDateProgressPercentage(field.startDate, field.endDate, currentDate);
    const isReady = field.status === FieldStatusEnum.ready || progress >= 100;

    return (
        <div className={"field-item"} style={{height: `${height-30}px`}}>
            <img src={field.img} alt="" className={"field-item-icon"}/>
            <div className={"field-item-info"}>
                <span className={"field-seed-title"}>{field.title}</span>
                {isReady &&
                    <span className={"field-seed-status"}>Ready</span>
                }
                <span className={'field-seed-progress'}
                      style={{width: `${progress}%`}}></span>
            </div>
        </div>
    )
}
