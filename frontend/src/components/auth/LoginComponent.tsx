import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup"

export const LoginComponent = () => {

    const loginSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required")
    });

    type LoginFormValues = {
        email: string;
        password: string;
    };

    const handleLoginSubmit = async (values: LoginFormValues) => {

        console.log(values);

    }

    return (
        <div>

            <div className={"auth-header"}></div>

            <div className={"login-form"}>
                <Formik initialValues={{
                    email: "",
                    password: "",
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
                            <label htmlFor="password">Password</label>
                            <Field type="password" id={"password"} name={"password"}/>
                            <ErrorMessage name="password" component="div" className="error-msg"/>
                        </div>
                        <div className="input-row">
                            <button className={"btn green"}>Login</button>
                        </div>

                    </Form>
                </Formik>

                <div className={'text-rl-lines'}>
                    <span></span>
                    <span>OR</span>
                    <span></span>
                </div>


                <div className="input-row">
                    <button className={"btn green icon-btn"}>
                        <img src="/public/images/icons/google.svg" alt=""/> <span>Continue with google</span>
                    </button>
                </div>

                <div className={"link"}>Register</div>

            </div>
        </div>
    )
}