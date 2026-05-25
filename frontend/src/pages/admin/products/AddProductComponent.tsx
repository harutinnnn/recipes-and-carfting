import {useEffect, useState} from "react";
import {Loader} from "lucide-react";
import * as Yup from "yup";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {FoodFileType, FoodType} from "@/types/FoodType";
import {getFood, saveFoodRequest} from "@/api/admin/admin.foods.api";
import {ProductFileType, ProductType} from "@/types/ProductType";
import {getProduct, saveProductRequest} from "@/api/admin/admin.products.api";
import {GenderEnum} from "@/enums/GenderEnum";
import {IngredientTypesEnum} from "@/enums/IngredientTypesEnum";
import {capitalize} from "@/helpers/text.helper";

export const AddProductComponent = ({id, cb}: { id: number, cb: () => void }) => {


    const [product, setProduct] = useState<ProductType | undefined>(undefined);

    const [loading, setLoading] = useState(true);


    const handleGetProduct = async (id: number) => {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data.item);
    };

    useEffect(() => {

        (async () => {
            await handleGetProduct(id);
            setLoading(false);
        })()

    }, [id, setProduct]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const validateSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        userProductTypes: Yup.mixed<IngredientTypesEnum>()
            .oneOf(Object.values(IngredientTypesEnum), "Invalid Product type")
            .required("Product type is required"),
    });


    const handleSubmit = async (values: ProductFileType) => {

        setError(null);
        setDisableBtn(true);


        const title = values.title;
        const userProductTypes = values.userProductTypes;

        const formData = new FormData();
        formData.append('id', id.toString())
        formData.append("title", title);
        formData.append("userProductTypes", userProductTypes);

        if (values.icon) {
            formData.append("icon", values.icon);
        }


        try {

            const data = await saveProductRequest(formData);

            if ("error" in data) {
                setError(data.error as string);
            } else {

                values.title = ""
            }
            cb()
            setDisableBtn(false);

            const product = await handleGetProduct(id);

            if (product !== undefined) {
                setProduct(product);
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
                        title: product?.title || "",
                        userProductTypes: product?.userProductTypes || IngredientTypesEnum.SEEDS,
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
                                <label htmlFor="email">Product type</label>
                                <Field as="select" name="userProductTypes" id="userProductTypes">

                                    {Object.values(IngredientTypesEnum).map(type => (
                                        <option value={type}
                                                key={type}>{capitalize(type)}</option>
                                    ))}

                                </Field>
                                <ErrorMessage name="userProductTypes" component="div" className="error-msg"/>
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

                                {product?.icon &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + product?.icon} alt=""
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
