import Logo from '../assets/logoImg.png'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Header } from 'antd/es/layout/layout'
import { logout } from '../redux/auth/auth.thunk'
import { RootState } from '../types/selector.types'
import { EConfigButtonType } from '../types/state.types'
import AppBreadcrumb from '../components/antdesign/appBreadcrumb'
import { Layout, Menu, Button, ConfigProvider, message } from 'antd'
import { ButtonThemeConfig } from '../components/antdesign/configs.components'
import { useLocation, Outlet, useNavigate, Link, Navigate } from 'react-router-dom'

const { Sider, Content } = Layout

const DashboardLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { user } = useSelector((state: RootState) => state.User)

    const [current, setCurrent] = useState(location.pathname.slice(11).split('/')[0])

    const path = location.pathname

    const logoutHandler = async () => {
        try {
            logout().then((res) => {
                if (res.success) {
                    navigate('/')
                }
            })
        } catch (error) {
            // @ts-ignore
            message.error(error.message)
        }
    }

    const adminItems = [
        {
            key: 'overview',
            label: 'Overview',
            to: 'overview'
        },
        {
            key: 'categories',
            label: 'Categories',
            to: 'categories'
        },
        {
            key: 'articles',
            label: 'Articles',
            to: 'articles'
        },
        {
            key: 'testimonials',
            label: 'Testimonials',
            to: 'testimonials'
        },
        {
            key: 'users',
            label: 'Users',
            to: 'users'
        }
    ]

    const onClick = (e: any) => {
        navigate(e.key)
        // setCurrent(e.key);
    }

    const getHeaderText = () => {
        if (path === '/dashboard/overview') {
            return `Welcome, ${user?.username}`
        } else if (path === '/dashboard/articles') {
            return 'Articles'
        } else if (path === '/dashboard/testimonials') {
            return 'Testimonials'
        } else if (path === `/dashboard/testimonials/add`) {
            return 'Add Testimonial'
        } else if (path === `/dashboard/articles/add`) {
            return 'Add Article'
        } else if (path.startsWith('/dashboard/articles/edit/')) {
            return 'Edit Article'
        } else if (path.startsWith('/dashboard/testimonials/edit/')) {
            return 'Edit Article'
        } else if (path === '/dashboard/categories') {
            return 'Categories'
        } else if (path === '/dashboard/users') {
            return 'Users'
        }
    }

    const renderMenuItems = (
        menuItems: {
            key: string
            label: string
            to: string
        }[]
    ) =>
        menuItems.map((item) => ({
            ...item,
            label: <span>{item.label}</span>
        }))
    useEffect(() => {
        setCurrent(location.pathname.slice(11).split('/')[0])
    }, [location.pathname])

    if (Object.keys(user).length === 0) {
        return (
            <Navigate
                to="/"
                replace
            />
        )
    }
    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        siderBg: '#FFF'
                    },
                    Menu: {
                        itemSelectedBg: '#816348',
                        itemSelectedColor: '#FFF',
                        itemColor: '#816348',
                        itemBorderRadius: 0,
                        itemHoverBg: '#816348',
                        itemHoverColor: '#FFF'
                    }
                }
            }}>
            <Layout className="font-sans h-screen font-regular">
                <Sider
                    width={308}
                    trigger={null}
                    collapsible
                    // onCollapse={(value) => setCollapsed(value)}
                    breakpoint="xl"
                    className="font-sans border-r border-[#E5E5E6] bg-[#EDE3D2]"
                    collapsedWidth={150}>
                    <Link
                        to="/dashboard/overview"
                        className="font-sans h-8 2xl:h-16 py-4 2xl:pt-5 my-4 pb-3 2xl:pb-8 flex justify-center items-center ">
                        <img
                            src={Logo}
                            className="w-[120px]"
                        />
                    </Link>
                    <Menu
                        onClick={onClick}
                        theme="light"
                        items={renderMenuItems(adminItems)}
                        mode="inline"
                        selectedKeys={[current]}
                        className="font-sans px-2 2xl:px-6 mt-6 text-sm 2xl:text-[20px] space-y-2 font-medium 2xl:leading-[22px] bg-[#EDE3D2] !border-none"
                    />

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            className="font-sans text-lg w-5/6 rounded-[100px] bg-primary h-8 2xl:h-12 text-white absolute m-2 2xl:m-6 bottom-5 border-primary"
                            type="default"
                            onClick={(e) => {
                                e.preventDefault()
                                logoutHandler()
                            }}>
                            Logout
                        </Button>
                    </ButtonThemeConfig>
                </Sider>
                <Layout>
                    <Header className="font-sans p-0 flex items-center flex-row justify-between h-14 2xl:h-16 bg-[url('/iktara-bg.png')] bg-cover bg-center bg-no-repeat w-full  border-primary">
                        <div className="lg:flex hidden flex-col justify-center items-start px-6">
                            <h3 className=" font-sans text-primary text-base 2xl:text-lg font-semibold capitalize">{getHeaderText()}</h3>
                            <div className="xl:flex hidden font-sans items-center justify-start text-grayText text-base">
                                {current !== 'overview' && <AppBreadcrumb />}
                            </div>
                        </div>
                        <div className="px-6 flex items-center justify-center gap-2"></div>
                    </Header>
                    <Content
                        style={{
                            minHeight: 280
                        }}
                        className="font-sans bg-[url('/iktara-bg.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full p-3 2xl:p-6 overflow-auto ">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default DashboardLayout
