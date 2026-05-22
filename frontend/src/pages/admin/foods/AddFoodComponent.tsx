import {useEffect, useState} from "react";
import {Loader} from "lucide-react";
import * as Yup from "yup";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {FoodFileType, FoodType} from "@/types/FoodType";
import {getFood, saveFoodRequest} from "@/api/admin/admin.foods.api";

export const AddFoodComponent = ({id, cb}: { id: number, cb: () => void }) => {


    const [food, setFood] = useState<FoodType | undefined>(undefined);

    const [loading, setLoading] = useState(true);


    const handleGetSeed = async (id: number) => {
        setLoading(true);
        const data = await getFood(id);
        setFood(data.item);
    };

    useEffect(() => {

        (async () => {
            await handleGetSeed(id);
            setLoading(false);
        })()

    }, [id, setFood]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const validateSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        price: Yup.number().required("Number is required"),
        energyPower: Yup.number().required("Number is required"),
    });


    const handleSubmit = async (values: FoodFileType) => {

        setError(null);
        setDisableBtn(true);


        const title = values.title;
        const price = values.price;
        const energyPower = values.energyPower;

        const formData = new FormData();
        formData.append('id', id.toString())
        formData.append("title", title);
        formData.append("price", price.toString());
        formData.append("energyPower", energyPower.toString());

        if (values.icon) {
            formData.append("icon", values.icon);
        }


        try {

            const data = await saveFoodRequest(formData);

            if ("error" in data) {
                setError(data.error as string);
            } else {

                values.title = ""
            }
            cb()
            setDisableBtn(false);

            const product = await handleGetSeed(id);

            if (product !== undefined) {
                setFood(product);
            }

        } catch (err) {

            setDisableBtn(false);

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Login failed");

            }

        }
    };


    if (loading) {
        return <Loader/>;
    }
    return (
        <div className={"form-container"}>

            {error && <Alerts text={error} type={AlertEnums.danger} cb={() => {
                setError(null)
            }}/>}
            {success && <Alerts text={success} type={AlertEnums.success} cb={() => {
                setSuccess(null)
            }}/>}

            <div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        title: food?.title || "",
                        price: food?.price || 0,
                        energyPower: food?.energyPower || 0,
                        icon: null,
                    }}
                    validationSchema={validateSchema}
                    onSubmit={handleSubmit}
                >
                    {({setFieldValue}) => (
                        <Form>

                            <div className="input-row">
                                <label htmlFor="title">Title</label>
                                <Field type="text" id="title" name="title" placeholder="Title"/>
                                <ErrorMessage name="title" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="price">Price</label>
                                <Field type="number" id="price" name="price" placeholder="Price"/>
                                <ErrorMessage name="price" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="energyPower">Energy power</label>
                                <Field type="number" id="energyPower" name="energyPower"
                                       placeholder="Minimum selling price"/>
                                <ErrorMessage name="energyPower" component="div" className="error-msg"/>
                            </div>


                            <div className={"image-container"}>
                                <div className="input-row">
                                    <label htmlFor="icon">Icon</label>
                                    <input
                                        type="file"
                                        id="icon"
                                        name="icon"
                                        onChange={(e) => {
                                            setFieldValue("icon", e.currentTarget.files?.[0]);
                                        }}
                                    />
                                    <ErrorMessage name="icon" component="div" className="error-msg"/>
                                </div>

                                {food?.icon &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + food?.icon} alt=""
                                             style={{width: '200px'}}/>
                                    </div>
                                }
                            </div>


                            <div className="input-row">
                                <button type={'submit'} disabled={disableBtn} className={'btn btn-green'}>Save</button>
                            </div>


                        </Form>
                    )}
                </Formik>

            </div>
        </div>
    )
}
