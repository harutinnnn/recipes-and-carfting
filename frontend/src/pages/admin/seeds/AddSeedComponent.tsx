import {useEffect, useState} from "react";
import {SeedFileType, SeedProgressImageType, SeedType} from "@/types/UserSeedsType";
import {getSeed, getSeedProgressImages, saveSeedRequest, uploadSeedProgressFile} from "@/api/admin/admin.seeds.api";
import {Loader} from "lucide-react";
import * as Yup from "yup";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {FileUploadComponent} from "@/pages/admin/seeds/FileUploadComponent";

export const AddSeedComponent = ({id, cb}: { id: number, cb: () => void }) => {


    const [seed, setSeed] = useState<SeedType | undefined>(undefined);
    const [progressImages, setProgressImages] = useState<SeedProgressImageType[]>([]);

    const [loading, setLoading] = useState(true);


    const [progressImage1, setProgressImage1] = useState<File | null>(null);
    const [progressImage2, setProgressImage2] = useState<File | null>(null);
    const [progressImage3, setProgressImage3] = useState<File | null>(null);
    const [progressImage4, setProgressImage4] = useState<File | null>(null);

    const handleGetSeed = async (id: number) => {
        setLoading(true);
        const seeditem = await getSeed(id);
        setSeed(seeditem.item);
    };

    const handleGetSeedProgressImage = async (seedId: number) => {
        setLoading(true);
        const data = await getSeedProgressImages(seedId)
        setProgressImages(data.items)
    }

    useEffect(() => {

        (async () => {
            await handleGetSeed(id);
            await handleGetSeedProgressImage(id)
            setLoading(false);
        })()

    }, [id, setSeed]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const validateSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        price: Yup.number().required("Number is required"),
        availableLevel: Yup.number().required("Available Level is required"),
        xpOnCollect: Yup.number().required("XP On Collect"),
        collectionTime: Yup.number().required("Collection Time"),
        takeEnergyCollect: Yup.number().required("Collection Time")
    });


    const handleSubmit = async (values: SeedFileType) => {

        setError(null);
        setDisableBtn(true);


        const title = values.title;
        const price = values.price;
        const availableLevel = values.availableLevel;
        const xpOnCollect = values.xpOnCollect;
        const collectionTime = values.collectionTime;
        const takeEnergyCollect = values.takeEnergyCollect;

        const formData = new FormData();
        formData.append('id', id.toString())
        formData.append("title", title);
        formData.append("price", price.toString());
        formData.append("availableLevel", availableLevel.toString());
        formData.append("xpOnCollect", xpOnCollect.toString());
        formData.append("collectionTime", collectionTime.toString());
        formData.append("takeEnergyCollect", takeEnergyCollect.toString());

        if (values.icon) {
            formData.append("icon", values.icon);
        }

        if (values.productImage) {
            formData.append("productImage", values.productImage);
        }

        if (values.readyProductImage) {
            formData.append("readyProductImage", values.readyProductImage);
        }

        try {

            const data = await saveSeedRequest(formData);

            if ("error" in data) {
                setError(data.error as string);
            } else {
                const progressImages = [
                    progressImage1,
                    progressImage2,
                    progressImage3,
                    progressImage4,
                ];

                await Promise.all(
                    progressImages.map((progressImage, index) => {
                        if (!progressImage) {
                            return Promise.resolve();
                        }

                        const formDataImg = new FormData();
                        formDataImg.append("seedId", data.id.toString());
                        formDataImg.append("pos", (index + 1).toString());
                        formDataImg.append("icon", progressImage);

                        return uploadSeedProgressFile(formDataImg);
                    })
                );

                values.title = ""
            }
            cb()
            setDisableBtn(false);

            const product = await handleGetSeed(id);

            if (product !== undefined) {
                setSeed(product);
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
                        title: seed?.title || "",
                        price: seed?.price || 0,
                        availableLevel: seed?.availableLevel || 0,
                        xpOnCollect: seed?.xpOnCollect || 0,
                        collectionTime: seed?.collectionTime || 0,
                        takeEnergyCollect: seed?.takeEnergyCollect || 0,
                        icon: null,
                        productImage: null,
                        readyProductImage: null
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
                                <label htmlFor="availableLevel">Available Level</label>
                                <Field type="number" id="availableLevel" name="availableLevel"
                                       placeholder="Available Level"/>
                                <ErrorMessage name="availableLevel" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="xpOnCollect">XP On Collect</label>
                                <Field type="number" id="xpOnCollect" name="xpOnCollect" placeholder="XP On Collect"/>
                                <ErrorMessage name="xpOnCollect" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="collectionTime">Collection Time seconds</label>
                                <Field type="number" id="collectionTime" name="collectionTime"
                                       placeholder="Collection Time"/>
                                <ErrorMessage name="collectionTime" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="takeEnergyCollect">Take Energy Collect</label>
                                <Field type="number" id="takeEnergyCollect" name="takeEnergyCollect"
                                       placeholder="Collection Time"/>
                                <ErrorMessage name="takeEnergyCollect" component="div" className="error-msg"/>
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

                                {seed?.icon &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + seed?.icon} alt=""
                                             style={{width: '200px'}}/>
                                    </div>
                                }
                            </div>


                            <div className={"image-container"}>
                                <div className="input-row">
                                    <label htmlFor="productImage">Product image</label>
                                    <input
                                        type="file"
                                        id="productImage"
                                        name="productImage"
                                        onChange={(e) => {
                                            setFieldValue("productImage", e.currentTarget.files?.[0]);
                                        }}
                                    />
                                    <ErrorMessage name="productImage" component="div" className="error-msg"/>
                                </div>

                                {seed?.productImage &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + seed?.productImage} alt=""
                                             style={{width: '200px'}}/>
                                    </div>
                                }

                            </div>


                            <div className={"image-container"}>
                                <div className="input-row">
                                    <label htmlFor="readyProductImage">Product image</label>
                                    <input
                                        type="file"
                                        id="readyProductImage"
                                        name="readyProductImage"
                                        onChange={(e) => {
                                            setFieldValue("readyProductImage", e.currentTarget.files?.[0]);
                                        }}
                                    />
                                    <ErrorMessage name="readyProductImage" component="div" className="error-msg"/>
                                </div>

                                {seed?.readyProductImage &&
                                    <div className={'data-image thumbnail m-b-2'}>
                                        <img src={import.meta.env.VITE_API_URL + seed?.readyProductImage} alt=""
                                             style={{width: '200px'}}/>
                                    </div>
                                }

                            </div>

                            <div className={"image-container"}>
                                <div className="input-row">
                                    <label>Progress images list</label>

                                    <div className={"file-upload-list"}>
                                        {Array.from({length: 4}).map((_, index) => (
                                            <FileUploadComponent
                                                progressImage={progressImages.find(
                                                    (icon) => Number(icon.pos) === index + 1
                                                )}
                                                key={index} cb={(file) => {

                                                switch (index) {
                                                    case 0:
                                                        setProgressImage1(file)
                                                        break;
                                                    case 1:
                                                        setProgressImage2(file)
                                                        break;
                                                    case 2:
                                                        setProgressImage3(file)
                                                        break;
                                                    case 3:
                                                        setProgressImage4(file)
                                                        break;
                                                }

                                            }}/>
                                        ))}
                                    </div>

                                </div>

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
