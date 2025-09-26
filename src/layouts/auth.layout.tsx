import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div className="font-sans bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex justify-center items-center">
            <Outlet />
        </div>
    )
}

export default AuthLayout
