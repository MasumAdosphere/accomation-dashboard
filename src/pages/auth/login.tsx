import { Form } from 'antd'
import { useState } from 'react'
import Logo from '../../assets/loginlogo.png'
import { useNavigate } from 'react-router-dom'
import { login } from '../../redux/auth/auth.thunk'
import { EConfigButtonType } from '../../types/state.types'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { SubmitButton, PasswordInput, TextItem } from '../../components/antdesign/form.components'

import mailIcon from '../../assets/mail-icon.svg'
import passwordIcon from '../../assets/password-icon.svg'
import { LoadingOutlined } from '@ant-design/icons'

const Login = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    //local states
    const [dataValues, setDataValues] = useState({
        email: '',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

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
                setIsSubmitting(true)
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
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    return (
        <div className="font-sans bg-white px-6 py-10 2xl:px-10 2xl:py-[60px] rounded-3xl flex flex-col justify-center items-center space-y-4 2xl:space-y-8 shadow">
            <div className="font-sans flex flex-col justify-center items-center">
                <img
                    src={Logo}
                    alt="logo"
                    className="w-[54px] h-[54px]"
                />
                <h2 className=" text-darkblue font-Metropolis font-semibold text-font22 mb-2">Sign in with email</h2>
                <p className="text-gray44 font-Metropolis font-medium text-font18">Log in using your email address for Accomation CRM</p>
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
                    {/* <label className="font-sans text-lg 2xl:text-[22px]">Email Address</label> */}
                    <TextItem
                        placeholder="Email"
                        type="email"
                        name="email"
                        required={true}
                        onChange={inputChangeHandler('email')}
                        icon={
                            <img
                                src={mailIcon}
                                alt="mail"
                                className="w-5 h-5 mr-2"
                            />
                        }
                        className=" text-gray44 font-Metropolis h-[52px] rounded-[6px] text-font20 font-medium border border-[#e5e5e5] hover:border-[#e5e5e5]  "
                    />
                    {/* <PhoneNumberItem
                        name="whatsAppNumber"
                        required={true}
                        contact={{ phone: whatsAppNumber }}
                        onChange={phoneInputChangeHandler}
                    /> */}
                </div>
                <div className="flex flex-col items-start justify-center gap-2 pb-4 !mt-4">
                    {/* <label className="font-sans text-lg 2xl:text-[22px]">Password</label> */}
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        required={true}
                        icon={
                            <img
                                src={passwordIcon}
                                alt="mail"
                                className="w-5 h-5 mr-2"
                            />
                        }
                        regex={/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,24}$/}
                        onChange={inputChangeHandler('password')}
                        className=" text-gray44 w-full font-Metropolis h-[52px] rounded-[6px] text-font20 font-medium border border-[#e5e5e5] hover:border-[#e5e5e5]"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <ButtonThemeConfig buttonType={EConfigButtonType.THIRD}>
                        <SubmitButton
                            className="w-[178px] rounded-[25px] text-center font-sans h-10 2xl:h-[53px] bg-darkblue !hover:bg-darkblue text-white text-base 2xl:text-[20px] shadow-none flex justify-center items-center"
                            text={isSubmitting ? 'Logging in...' : 'Login'}
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                        />
                    </ButtonThemeConfig>
                </div>
            </Form>
        </div>
    )
}

export default Login
