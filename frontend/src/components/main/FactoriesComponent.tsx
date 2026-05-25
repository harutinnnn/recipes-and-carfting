import {useEffect, useRef, useState} from "react";
import {FieldItemTypeJoin} from "@/types/FieldItemType";
import {buyNewField, getUserFactoriesJoin, getUserFieldsJoin, UserFactoriesResponseJoin} from "@/api/main.api";
import toast from "react-hot-toast";
import {FieldItem} from "@/components/fields/FieldItem";
import {FactoryItemTypeJoin} from "@/types/FactoryType";
import {FactoryItem} from "@/components/fields/FactoryItem";

export const FactoriesComponent = () => {

    const elementRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [factories, setFactories] = useState<FactoryItemTypeJoin[]>([]);

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

    const getUserFactories = async () => {
        const userFields = await getUserFactoriesJoin()
        setFactories(userFields.items)
    }


    useEffect(() => {
        (async () => {

            await getUserFactories()

        })()
    }, [setFactories]);


    const handleBuyNewField = async () => {

        const data = await buyNewField();

        if ("error" in data) {
            toast.error(data?.error + "")
        }
        await getUserFactories()

    }

    return (
        <>
            <div className="fields-container" ref={elementRef}>
                <h2 className={"container-title"}>Factories</h2>

                <div className={"fields-list"}>

                    {factories.map(factory => <FactoryItem factory={factory} key={factory.userFactories.id} height={width / 5}
                                                    cb={() => getUserFactories()}/>)}

                </div>
            </div>
        </>
    )
}