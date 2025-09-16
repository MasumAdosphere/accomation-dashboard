/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import { Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import Separator from '../../assets/seperator.svg'

type Path =
    | '/dashboard/overview'
    | '/dashboard/articles'
    | '/dashboard/testimonials'
    | '/dashboard/articles/add'
    | '/dashboard/testimonials/add'
    | '/dashboard/categories'
    | '/dashboard/articles/edit'
    | '/dashboard/testimonials/edit'
    | '/dashboard/users'

// Define a type for the pathTitleMap object
type PathTitleMap = {
    [key in Path]: string
}
const AppBreadcrumb = () => {
    const location = useLocation()
    const allowedPaths = [
        '/dashboard/overview',
        '/dashboard/articles',
        '/dashboard/testimonials',
        '/dashboard/articles/edit',
        '/dashboard/categories',
        '/dashboard/articles/add',
        '/dashboard/users'
    ]

    // Return null if the current path is not allowed
    if (!allowedPaths.some((path) => location.pathname.startsWith(path))) {
        return null
    }

    const pathTitleMap: PathTitleMap = {
        '/dashboard/overview': 'Overview',
        '/dashboard/articles': 'Articles',
        '/dashboard/testimonials': 'Testimonials',
        '/dashboard/testimonials/add': 'Add Testimonials',
        '/dashboard/testimonials/edit': 'Edit Testimonials',
        '/dashboard/articles/edit': 'Edit Article',
        '/dashboard/categories': 'Categories',
        '/dashboard/articles/add': 'Add Article',
        '/dashboard/users': 'Users'
    }

    const items = [
        {
            path: 'overview',
            title: 'Home'
        }
    ]

    const pathSegments = location.pathname.split('/').filter((i) => i)
    let currentPath = ''

    pathSegments.forEach((segment) => {
        currentPath += `/${segment}`
        if (currentPath === '/dashboard/home') {
            items.push({
                path: currentPath,
                title: ''
            })
        } else if (
            // @ts-ignore
            pathTitleMap[currentPath]
        ) {
            items.push({
                path: currentPath,
                // @ts-ignore
                title: pathTitleMap[currentPath]
            })
        }
    })

    // @ts-ignore
    function itemRender(currentRoute: { path: string; title: string }, _params: unknown, routes: [{ path: string }]) {
        const isLast = currentRoute.path === routes[routes.length - 1].path
        return isLast ? <span>{currentRoute.title}</span> : <Link to={currentRoute.path}>{currentRoute.title}</Link>
    }

    return (
        <Breadcrumb
            // @ts-ignore
            itemRender={itemRender}
            items={items}
            separator={<img src={Separator} />}
            className="text-sm 2xl:text-base font-sans items-end flex !text-primary"
        />
    )
}

export default AppBreadcrumb
