import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup"
import type {AuthViewCallback} from "@/types/auth";
import {GenderEnum} from "@/enums/GenderEnum";
import {capitalize} from "@/helpers/text.helper";
import {registerRequest} from "@/api/auth.api";
import {useState} from "react";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";

export const RegisterComponent = ({cb}: { cb: AuthViewCallback }) => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [disableBtn, setDisableBtn] = useState(false);

    const registerSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        name: Yup.string().required("Required"),
        nickname: Yup.string().required("Required"),
        gender: Yup.mixed<GenderEnum>()
            .oneOf(Object.values(GenderEnum), "Invalid gender")
            .required("Gender is required"),
        password: Yup.string().min(6, "Minimum 6 characters").required("Required")
    });

    type RegisterFormValues = {
        email: string;
        name: string;
        nickname: string;
        gender: GenderEnum.MALE,
        password: string;
    };

    const handleRegisterSubmit = async (values: RegisterFormValues) => {

        const email = values.email;
        const name = values.name;
        const nickname = values.nickname;
        const gender = values.gender;
        const password = values.password;


        const data = await registerRequest({
            email, name, nickname, gender, password
        })

        if ("error" in data) {
            setError(data.error as string);
        } else {

            setSuccess("Successfully registered please check your email!");

            setTimeout(() => {
                setSuccess(null);
            }, 5000)

            values.name = ''
            values.nickname = ''
            values.email = ''
            values.password = ''
        }
        setDisableBtn(false);

    }


    return (
        <div>


            <div className={"auth-header"}>
                <h1>Sign Up</h1>
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
                    name: "",
                    nickname: "",
                    gender: GenderEnum.MALE,
                    password: "",
                }}
                        onSubmit={handleRegisterSubmit}
                        validationSchema={registerSchema}
                >
                    <Form>
                        <div className="input-row">
                            <label htmlFor="email">Email</label>
                            <Field type="text" id={"email"} name={"email"} placeholder="jowhn.smith@economy.com"/>
                            <ErrorMessage name="email" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <label htmlFor="name">Name</label>
                            <Field type="text" id={"name"} name={"name"} placeholder="John Smitt"/>
                            <ErrorMessage name="name" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <label htmlFor="nickname">Nickname</label>
                            <Field type="text" id={"nickname"} name={"nickname"} placeholder="Your nickname"/>
                            <ErrorMessage name="nickname" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <label htmlFor="email">Email</label>
                            <Field as="select" name="gender" id="gender">

                                <option value={GenderEnum.MALE}
                                        key={GenderEnum.MALE}>{capitalize(GenderEnum.MALE)}</option>
                                <option value={GenderEnum.FEMALE}
                                        key={GenderEnum.FEMALE}>{capitalize(GenderEnum.FEMALE)}</option>
                                <option value={GenderEnum.UNKNOWN}
                                        key={GenderEnum.UNKNOWN}>{capitalize(GenderEnum.UNKNOWN)}</option>


                            </Field>
                            <ErrorMessage name="gender" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <label htmlFor="nickname">Nickname</label>
                            <Field type="text" id={"nickname"} name={"nickname"} placeholder="Your nickname"/>
                            <ErrorMessage name="nickname" component="div" className="error-msg"/>
                        </div>

                        <div className="input-row">
                            <label htmlFor="password">Password</label>
                            <Field type="password" id={"password"} name={"password"}/>
                            <ErrorMessage name="password" component="div" className="error-msg"/>
                        </div>
                        <div className="input-row">
                            <button className={"btn green"}>Register</button>
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

                <div className={"link"} onClick={() => cb('login')}>Login
                </div>

            </div>
        </div>
    )
}
