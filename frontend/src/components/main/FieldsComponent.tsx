import {useEffect, useRef, useState} from "react";
import {FieldItemTypeJoin} from "@/types/FieldItemType";
import {buyNewField, getFieldPrice, getUserFieldsJoin} from "@/api/main.api";
import toast from "react-hot-toast";
import {ConfirmModal} from "@/components/ConfirmModal";
import {CirclePlus} from "lucide-react";
import {FieldItem} from "@/components/fields/FieldItem";

export const FieldsComponent = () => {

    const elementRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [fields, setFields] = useState<FieldItemTypeJoin[]>([]);
    const [fieldPrice, setFieldPrice] = useState<number>(0);

    const [open, setOpen] = useState(false);


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

            const fieldPrice = await getFieldPrice()
            setFieldPrice(fieldPrice)
        })()
    }, [setFields]);


    const handleBuyNewField = async () => {

        const data = await buyNewField();

        if ("error" in data) {
            toast.error(data?.error + "")
        }else{
            setOpen(false);
        }
        setOpen(true)
        await getUserFields()

    }

    return (
        <>
            <div className="fields-container" ref={elementRef}>
                <h2 className={"container-title"}>Fields</h2>

                <div className={"fields-list"}>

                    {fields.map(field => <FieldItem field={field} key={field.userFields.id} height={width / 5}
                                                    cb={() => getUserFields()}/>)}

                    <div className={"field-item buy-new-field"} style={{height: `${((width / 5) - 30)}px`}}
                         onClick={() => {

                             setOpen(true);
                         }}>
                        <div className={"add-new-item-buton"}>
                            <CirclePlus size={42}/>
                            <div className={"flex flex-row align-center gap-5"}>

                                <span>New Field</span>

                                <img
                                    src="/public/images/icons/game-money.png"
                                    className={"game-money-icon"}
                                    alt=""
                                />
                                <span>
                                {fieldPrice}
                            </span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                title={"Are you sure do but a new field?"}
                // description={""}
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={handleBuyNewField}
            />
        </>
    )
}