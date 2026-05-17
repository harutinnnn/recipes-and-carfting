import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup"
import type {AuthViewCallback} from "@/types/auth";
import {AxiosError} from "axios";
import {forgotRequest} from "@/api/auth.api";
import {useState} from "react";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";

export const ForgotComponent = ({cb}: { cb: AuthViewCallback }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
    });

    type LoginFormValues = {
        email: string;
    };

    const handleLoginSubmit = async (values: LoginFormValues) => {

        setError("");

        const email = values.email;

        try {
            const data = await forgotRequest({email});


            if ("error" in data) {
                setError(data.error)
            } else {
                setSuccess(data?.message)
            }

        } catch (err) {

            console.error(err);

            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Forgot failed");
            }
        }

    }

    return (
        <div>


            <div className={"auth-header"}>
                <h1>Forgot password</h1>
            </div>

            {error && <Alerts text={error} type={AlertEnums.danger} cb={() => {
                setError(null)
            }}/>}
            {success && <Alerts text={success} type={AlertEnums.success} cb={() => {
                setSuccess(null)
            }}/>}


            <div className={"login-form"}>
                <Formik initialValues={{
                    email: "",
                }}
                        onSubmit={handleLoginSubmit}
                        validationSchema={loginSchema}
                >
                    <Form>
                        <div className="input-row">
                            <label htmlFor="email">Email</label>
                            <Field type="text" id={"email"} name={"email"} placeholder="jowhn.smith@economy.com"/>
                            <ErrorMessage name="email" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <button className={"btn green"}>Forgot</button>
                        </div>

                    </Form>
                </Formik>

                <div className={"link"} onClick={() => cb('login')}>Login
                </div>

            </div>
        </div>
    )
}
