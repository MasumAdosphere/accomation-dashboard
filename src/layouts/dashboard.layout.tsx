import Logo from '../assets/white-logo.png'
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
import logoutIcon from '../assets/logout.png'
import { getProfile } from '../redux/user/user.thunk'

const { Sider, Content } = Layout

const DashboardLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { user } = useSelector((state: RootState) => state.User)

    const [current, setCurrent] = useState(location.pathname.slice(11).split('/')[0])

    const path = location.pathname

    const [profileName, setProfileName] = useState<string>('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile()
                setProfileName(data?.name || '')
                console.log(data)
            } catch (error) {
                setProfileName('')
            }
        }

        fetchProfile()
    }, [])

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
            key: 'blogs',
            label: 'Blogs',
            to: 'blogs',
            children: [
                { key: 'categories', label: 'Categories', to: 'categories' },
                { key: 'articles', label: 'Articles', to: 'articles' }
            ]
        },

        {
            key: 'testimonials',
            label: 'Testimonials',
            to: 'testimonials'
        },
        {
            key: 'faq',
            label: 'Faqs',
            to: 'faq'
        },
        {
            key: 'logos',
            label: 'Logos',
            to: 'logos'
        },
        {
            key: 'career',
            label: 'Career',
            to: 'career'
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
        } else if (path.startsWith('/dashboard/testimonials/edit/')) {
            return 'Edit Article'
        } else if (path === `/dashboard/articles/add`) {
            return 'Add Article'
        } else if (path.startsWith('/dashboard/articles/edit/')) {
            return 'Edit Article'
        } else if (path === '/dashboard/categories') {
            return 'Categories'
        } else if (path === '/dashboard/users') {
            return 'Users'
        } else if (path === '/dashboard/faq') {
            return 'Faqs'
        } else if (path === `/dashboard/faq/add`) {
            return 'Add Faqs'
        } else if (path.startsWith('/dashboard/faq/edit/')) {
            return 'Edit Faqs'
        } else if (path === '/dashboard/logos') {
            return 'Logos'
        } else if (path === '/dashboard/logos/add') {
            return 'Add Logos'
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
                        siderBg: '#0E082B'
                    },
                    Menu: {
                        itemSelectedBg: '#FFDE39',
                        itemSelectedColor: '#0E082B',
                        itemColor: '#FFF',
                        subMenuItemBg: '#0E082B',
                        itemBorderRadius: 0,
                        itemHoverBg: '#FFDE39',
                        itemHoverColor: '#0E082B'
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
                    className="font-sans border-r border-darkblue bg-darkblue"
                    collapsedWidth={150}>
                    <Link
                        to="/dashboard/overview"
                        className="font-sans h-8 2xl:h-16 py-4 2xl:pt-5 my-4 pb-3 2xl:pb-8 flex justify-center items-center ">
                        <img
                            src={Logo}
                            className="w-full px-10"
                        />
                    </Link>
                    <Menu
                        onClick={onClick}
                        theme="light"
                        items={renderMenuItems(adminItems)}
                        mode="inline"
                        selectedKeys={[current]}
                        className="font-sans px-2 2xl:px-6 mt-6 text-sm 2xl:text-[20px] space-y-2 font-medium 2xl:leading-[22px] bg-[#0E082B] !border-none"
                    />
                </Sider>
                <Layout>
                    <Header className="font-sans p-0 flex items-center flex-row justify-between h-14 2xl:h-16 bg-[#F0F3F4] bg-cover bg-center bg-no-repeat w-full  border-primary">
                        <div className="lg:flex w-full hidden  justify-between items-center px-6">
                            <div className="">
                                <h3 className=" font-sans text-primary text-base 2xl:text-lg font-semibold capitalize">Welcome {profileName}</h3>
                                <div className="xl:flex hidden font-sans items-center justify-start text-grayText text-base">
                                    {current !== 'overview' && <AppBreadcrumb />}
                                </div>
                            </div>
                            <div className="">
                                <ButtonThemeConfig buttonType={EConfigButtonType.THIRD}>
                                    <Button
                                        className="font-sans text-lg w-[120px] h-[48px] rounded-[100px] bg-darkblue  2xl:h-12 text-white  m-2 2xl:m-6  border-primary"
                                        type="default"
                                        icon={
                                            <img
                                                src={logoutIcon}
                                                alt="logout"
                                                className="w-3 h-3 "
                                            />
                                        }
                                        onClick={(e) => {
                                            e.preventDefault()
                                            logoutHandler()
                                        }}>
                                        Logout
                                    </Button>
                                </ButtonThemeConfig>
                            </div>
                        </div>

                        {/* <div className="px-6 flex items-center justify-center gap-2"></div> */}
                    </Header>
                    <Content
                        style={{
                            minHeight: 280
                        }}
                        className="font-sans bg-white bg-cover bg-center bg-no-repeat min-h-screen w-full p-3 2xl:p-6 overflow-auto ">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default DashboardLayout
