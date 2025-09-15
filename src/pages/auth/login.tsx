import { Form } from 'antd'
import { ChangeEvent, useState } from 'react'
import Logo from '../../assets/footer-logopng.png'
import { useNavigate } from 'react-router-dom'
import { login } from '../../redux/auth/auth.thunk'
import { EConfigButtonType } from '../../types/state.types'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { SubmitButton, PasswordInput, TextItem } from '../../components/antdesign/form.components'

const Login = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    //local states
    const [dataValues, setDataValues] = useState({
        email: '',
        password: ''
    })

    const { email, password } = dataValues

    // function to handle change in inputs
    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setDataValues({ ...dataValues, [name]: value })
    }

    const submitBtnHandler = () => {
        // e.preventDefault()
        form.validateFields()
            .then(() => {
                return login(dataValues)
            })
            .then((response) => {
                if (response.success) {
                    navigate('/dashboard/overview')
                }
                // setIsDisabled(false);
            })
            .catch(() => {
                setDataValues({ ...dataValues, password: '' })
                // setIsDisabled(false);
            })
    }

    return (
        <div className="font-sans bg-white px-6 py-10 2xl:px-10 2xl:py-[60px] rounded-3xl flex flex-col justify-center items-center space-y-4 2xl:space-y-8 shadow">
            <div className="font-sans flex flex-col justify-center items-center gap-6">
                <img
                    src={Logo}
                    alt="logo"
                    className="w-40"
                />

                <span className="font-sans text-primary font-medium text-2xl 2xl:text-[30px]">Login</span>
            </div>
            <Form
                form={form}
                className="font-sans flex flex-col space-y-2 2x:space-y-4 w-[400px] 2xl:w-[550px]"
                onFinish={submitBtnHandler}
                fields={[
                    {
                        name: 'email',
                        value: email
                    },
                    {
                        name: 'password',
                        value: password
                    }
                ]}>
                <div className="flex flex-col items-start justify-center gap-2">
                    <label className="font-sans text-lg 2xl:text-[22px]">Email Address</label>
                    <TextItem
                        placeholder="Enter email address"
                        type="email"
                        name="email"
                        required={true}
                        onChange={inputChangeHandler('email')}
                    />
                    {/* <PhoneNumberItem
                        name="whatsAppNumber"
                        required={true}
                        contact={{ phone: whatsAppNumber }}
                        onChange={phoneInputChangeHandler}
                    /> */}
                </div>
                <div className="flex flex-col items-start justify-center gap-2 pb-4 !mt-4">
                    <label className="font-sans text-lg 2xl:text-[22px]">Password</label>
                    <PasswordInput
                        name="password"
                        placeholder="Enter your password"
                        required={true}
                        regex={/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,24}$/}
                        onChange={inputChangeHandler('password')}
                    />
                </div>

                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <SubmitButton
                        className="w-full rounded-lg font-sans h-10 2xl:h-[53px] bg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flex justify-center items-center"
                        text="Login"
                    />
                </ButtonThemeConfig>
            </Form>
        </div>
    )
}

export default Login
