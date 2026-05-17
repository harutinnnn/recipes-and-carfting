import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup"
import type {AuthViewCallback} from "@/types/auth";

export const ForgotComponent = ({cb}: { cb: AuthViewCallback }) => {

    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
    });

    type LoginFormValues = {
        email: string;
    };

    const handleLoginSubmit = async (values: LoginFormValues) => {

        console.log(values);

    }

    return (
        <div>


            <div className={"auth-header"}>
                <h1>Forgot password</h1>
            </div>

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
