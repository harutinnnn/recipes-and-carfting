import {FieldItem} from "@/components/fields/FieldItem";
import {FieldStatusEnum} from "@/enums/FieldStatusEnum";
import {datePlusSomeTime} from "@/helpers/date.helper";
import {useEffect, useRef, useState} from "react";


const now = new Date();

const fields = [
    {
        id: 1,
        img: '/public/images/carrot.png',
        status: FieldStatusEnum.in_progress,
        title: 'Carrot',
        startDate: now,
        endDate: datePlusSomeTime(now, 10),
    },
    {
        id: 2,
        img: '/public/images/wheat.png',
        status: FieldStatusEnum.ready,
        title: 'Wheat',
        startDate: now,
        endDate: datePlusSomeTime(now, 0),
    }, {
        id: 3,
        img: '/public/images/unnamed.png',
        status: FieldStatusEnum.in_progress,
        title: 'Barn',
        startDate: now,
        endDate: datePlusSomeTime(now, 1500),
    }
]


export const MainPage = () => {

    const elementRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);


    useEffect(() => {
        const updateWidth = () => {
            if (elementRef.current) {
                setWidth(elementRef.current.offsetWidth);
            }
        };

        updateWidth(); // initial width

        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const [fieldsCount] = useState<number>(4);

    return (

        <div>

            <div className="fields-container" ref={elementRef}>
                <h2 className={"container-title"}>Fields
                    ({fieldsCount}/{(fieldsCount - (fieldsCount - fields.length))})</h2>

                <div className={"fields-list"}>

                    {fields.map(field => <FieldItem field={field} key={field.id} height={width / 3}/>)}

                    {fieldsCount > fields.length && Array(fieldsCount - fields.length).fill(null).map((_, i) =>
                        <FieldItem field={null} key={`empty-field-${i}`} height={width / 3}/>
                    )}

                    <div className={"field-item"}>
                    </div>
                </div>
            </div>

        </div>
    )
}