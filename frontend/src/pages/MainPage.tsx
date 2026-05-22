import {FieldItem} from "@/components/fields/FieldItem";
import {useEffect, useRef, useState} from "react";
import {getUserFieldsJoin} from "@/api/main.api";
import {FieldItemTypeJoin} from "@/types/FieldItemType";


export const MainPage = () => {

    const elementRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [fields, setFields] = useState<FieldItemTypeJoin[]>([]);


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

    const getUserFields = async () => {
        const userFields = await getUserFieldsJoin()
        setFields(userFields.items)
    }


    useEffect(() => {
        (async () => {

            await getUserFields()
        })()
    }, [setFields]);


    return (

        <div>

            <div className="fields-container" ref={elementRef}>
                <h2 className={"container-title"}>Fields</h2>

                <div className={"fields-list"}>

                    {fields.map(field => <FieldItem field={field} key={field.userFields.id} height={width / 3}
                                                    cb={() => getUserFields()}/>)}

                    <div className={"field-item"}>

                    </div>
                </div>
            </div>

        </div>
    )
}