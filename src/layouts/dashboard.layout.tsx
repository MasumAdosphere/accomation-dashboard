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

import blogActive from '../assets/blogActive.svg'
import blogInActive from '../assets/blogInactive.svg'
import careerActive from '../assets/careerActive.svg'
import careerInActive from '../assets/CareerInactive.svg'
import categoryInActive from '../assets/categoryInactive.svg'
import categoryActive from '../assets/categoryActive.svg'
import testimonialActive from '../assets/testimonialsActive.svg'
import testimonialInactive from '../assets/testimonialsInactive.svg'
import faqInactive from '../assets/faqInactive.svg'
import faqActive from '../assets/faqActive.svg'
import clientInactive from '../assets/clientInactive.svg'
import clientActive from '../assets/logoActive.svg'
import userActive from '../assets/userActive.svg'
import userInActive from '../assets/userInactive.svg'
import { icons } from 'antd/es/image/PreviewGroup'

const { Sider, Content } = Layout

const DashboardLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { user } = useSelector((state: RootState) => state.User)

    const [current, setCurrent] = useState(location.pathname.slice(11).split('/')[0])

    const path = location.pathname

    const [profileName, setProfileName] = useState<string>('')

    const [hoveredKey, setHoveredKey] = useState<string | null>(null)

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
            icon: current === 'overview' ? <img src={blogActive} /> : <img src={blogInActive} />,
            to: 'overview'
        },
        {
            key: 'blogs',
            label: 'Blog Management',
            icon: current === 'categories' || current === 'articles' ? <img src={blogActive} /> : <img src={blogInActive} />,
            to: 'blogs',
            children: [
                {
                    key: 'categories',
                    label: '· Categories',
                    to: 'categories'

                    // icon: current === 'categories' ? <img src={categoryActive} /> : <img src={categoryInActive} />
                },
                {
                    key: 'articles',
                    label: '· Published Blogs',
                    to: 'articles'
                    // icon: current === 'blogs' ? <img src={blogInActive} /> : <img src={blogInActive} />
                }
            ]
        },

        {
            key: 'testimonials',
            label: 'Testimonials',
            to: 'testimonials',
            icon: current === 'testimonials' ? <img src={testimonialActive} /> : <img src={testimonialInactive} />
        },
        {
            key: 'faq',
            label: 'Faqs',
            to: 'faq',
            icon: current === 'faq' ? <img src={faqActive} /> : <img src={faqInactive} />
        },
        {
            key: 'logos',
            label: 'Client Logos',
            to: 'logos',
            icon: current === 'logos' ? <img src={clientActive} /> : <img src={clientInactive} />
        },
        {
            key: 'career',
            label: 'Career',
            to: 'career',
            icon: current === 'career' ? <img src={careerActive} /> : <img src={careerInActive} />
        },
        {
            key: 'users',
            label: 'Users',
            to: 'users',
            icon: current === 'users' ? <img src={careerActive} /> : <img src={careerInActive} />
        }
    ]

    const onClick = (e: any) => {
        setHoveredKey(null) // Add this line to reset hover state

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

    const [openKeys, setOpenKeys] = useState<string[]>([])

    const handleOpenChange = (keys: string[]) => {
        setOpenKeys(keys)
    }

    useEffect(() => {
        setCurrent(location.pathname.slice(11).split('/')[0])
    }, [location.pathname])

    const renderMenuItems = (items: typeof adminItems, openKeys: string[]) => {
        return items.map((item) => {
            const isActive = current === item.key
            const isOpen = openKeys.includes(item.key)
            const isHovered = hoveredKey === item.key

            // Check if any child is active (for parent menus with children)
            const isChildActive = item.children?.some((child) => current === child.key) ?? false

            let icon

            if (item.key === 'overview') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={blogActive}
                            alt="Overview"
                        />
                    ) : (
                        <img
                            src={blogInActive}
                            alt="Overview"
                        />
                    )
            } else if (item.key === 'blogs') {
                // Only active if one of the child routes is active, ignore hover
                icon = isChildActive ? (
                    <img
                        src={blogActive}
                        alt="Blogs"
                    />
                ) : (
                    <img
                        src={blogInActive}
                        alt="Blogs"
                    />
                )
            } else if (item.key === 'testimonials') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={testimonialActive}
                            alt="Testimonials"
                        />
                    ) : (
                        <img
                            src={testimonialInactive}
                            alt="Testimonials"
                        />
                    )
            } else if (item.key === 'faq') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={faqActive}
                            alt="FAQs"
                        />
                    ) : (
                        <img
                            src={faqInactive}
                            alt="FAQs"
                        />
                    )
            } else if (item.key === 'logos') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={clientActive}
                            alt="Logos"
                        />
                    ) : (
                        <img
                            src={clientInactive}
                            alt="Logos"
                        />
                    )
            } else if (item.key === 'career') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={careerActive}
                            alt="Career"
                        />
                    ) : (
                        <img
                            src={careerInActive}
                            alt="Career"
                        />
                    )
            } else if (item.key === 'users') {
                icon =
                    isActive || isHovered ? (
                        <img
                            src={userActive}
                            alt="Users"
                        />
                    ) : (
                        <img
                            src={userInActive}
                            alt="Users"
                        />
                    )
            } else {
                icon = item.icon
            }

            if (item.children) {
                return {
                    key: item.key,
                    label: item.label,
                    icon,
                    onMouseEnter: () => setHoveredKey(item.key),
                    onMouseLeave: () => setHoveredKey(null),
                    children: item.children.map((child) => ({
                        key: child.key,
                        label: child.label,
                        onMouseEnter: () => setHoveredKey(item.key),
                        onMouseLeave: () => setHoveredKey(null),
                        onClick: () => {
                            setHoveredKey(null)
                            onClick({ key: child.key } as any)
                        }
                    }))
                }
            }

            return {
                key: item.key,
                label: item.label,
                icon,
                onMouseEnter: () => setHoveredKey(item.key),
                onMouseLeave: () => setHoveredKey(null),
                onClick: () => {
                    setHoveredKey(null)
                    onClick({ key: item.key } as any)
                }
            }
        })
    }

    // const renderMenuItems = (
    //     menuItems: {
    //         key: string
    //         label: string
    //         to: string
    //     }[]
    // ) =>
    //     menuItems.map((item) => ({
    //         ...item,
    //         label: <span>{item.label}</span>
    //     }))

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
                        itemBorderRadius: 8,
                        itemHoverBg: '#FFDE39',
                        itemHoverColor: '#0E082B',
                        borderRadius: 8
                    }
                }
            }}>
            <Layout className="font-sans h-screen font-regular">
                <Sider
                    width={320}
                    trigger={null}
                    collapsible
                    // onCollapse={(value) => setCollapsed(value)}
                    breakpoint="xl"
                    className="font-sans border-r border-darkblue bg-darkblue"
                    collapsedWidth={150}>
                    <Link
                        to="/dashboard/overview"
                        className="font-sans  py-4 2xl:pt-5 my-4 pb-3 2xl:pb-8 flex justify-center items-center ">
                        <img
                            src={Logo}
                            className="w-[240px] h-auto"
                        />
                    </Link>
                    <Menu
                        onClick={onClick}
                        theme="light"
                        items={renderMenuItems(adminItems, openKeys)}
                        mode="inline"
                        selectedKeys={[current]}
                        openKeys={openKeys}
                        onOpenChange={handleOpenChange}
                        className="font-sans 2xl:px-6 mt-6 text-font16 space-y-2 font-semibold 2xl:leading-[22px] bg-[#0E082B] !border-none"
                    />
                </Sider>
                <Layout>
                    <Header className="font-sans p-0 flex items-center flex-row justify-between h-[88px] !bg-transparent border-b-[1px] border-[#EEEEEE] bg-cover bg-center bg-no-repeat w-full  ">
                        <div className="lg:flex w-full hidden  justify-between items-center bg-transparent py-5 px-6">
                            <div className="">
                                <h3 className=" font-sans text-primary text-base 2xl:text-lg font-semibold capitalize">Welcome {profileName}</h3>
                                <div className=" text-font16 font-medium font-Metropolis !text-gray44">
                                    {current !== 'overview' && <AppBreadcrumb />}
                                </div>
                            </div>

                            <ButtonThemeConfig buttonType={EConfigButtonType.THIRD}>
                                <Button
                                    className="font-sans text-lg w-[160px] h-[48px] rounded-[100px] bg-darkblue  2xl:h-12 text-font16 text-white "
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

                        {/* <div className="px-6 flex items-center justify-center gap-2"></div> */}
                    </Header>
                    <Content
                        style={{
                            minHeight: 280
                        }}
                        className="font-sans bg-white bg-cover bg-center bg-no-repeat min-h-screen w-full py-3 px-6  overflow-auto ">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default DashboardLayout
