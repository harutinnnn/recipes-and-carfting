import {useEffect, useState} from "react";
import {Loader} from "lucide-react";
import * as Yup from "yup";
import {AxiosError} from "axios";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {SettingType} from "@/types/SettingsType";
import {getSetting, saveSettingRequest} from "@/api/admin/admin.settings.api";

export const AddSettingComponent = ({id, cb}: { id: number, cb: () => void }) => {


    const [setting, setSettings] = useState<SettingType | undefined>(undefined);

    const [loading, setLoading] = useState(true);


    const handleGetSetting = async (id: number) => {
        setLoading(true);
        try {
            const data = await getSetting(id);
            setSettings(data.item);
            return data.item;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        (async () => {
            await handleGetSetting(id);
        })()

    }, [id, setSettings]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const validateSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        key: Yup.string().required("Key is required"),
        value: Yup.string().required("Value is required"),
    });


    const handleSubmit = async (values: SettingType) => {

        setError(null);
        setDisableBtn(true);


        const payload: SettingType = {
            id,
            title: values.title,
            key: values.key,
            value: values.value,
        };

        try {

            const data = await saveSettingRequest(payload);

            if ("error" in data) {
                setError(data.error as string);
            } else {
                setSettings(data);
                setSuccess("Setting saved successfully");
            }
            cb();
            await handleGetSetting(id);

        } catch (err) {

            if (err instanceof AxiosError) {

                setError(err.response?.data?.message || "Failed to save setting");

            }

        } finally {
            setDisableBtn(false);
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
                        title: setting?.title || "",
                        value: setting?.value || "",
                        key: setting?.key || "",
                    }}
                    validationSchema={validateSchema}
                    onSubmit={handleSubmit}
                >
                        <Form>

                            <div className="input-row">
                                <label htmlFor="title">Title</label>
                                <Field type="text" id="title" name="title" placeholder="Title"/>
                                <ErrorMessage name="title" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="key">Key</label>
                                <Field type="text" id="key" name="key" placeholder="Key"/>
                                <ErrorMessage name="key" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <label htmlFor="value">Value</label>
                                <Field type="text" id="value" name="value" placeholder="Value"/>
                                <ErrorMessage name="value" component="div" className="error-msg"/>
                            </div>

                            <div className="input-row">
                                <button type={'submit'} disabled={disableBtn} className={'btn btn-green'}>Save</button>
                            </div>


                        </Form>
                </Formik>

            </div>
        </div>
    )
}
