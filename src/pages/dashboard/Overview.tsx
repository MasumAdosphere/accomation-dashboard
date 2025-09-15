import { useEffect, useState } from 'react'
import { IInsights } from '../../types/state.types'
import { getInsights } from '../../redux/insights/insights.thunk'
import LoadingComponent from '../../components/custom/loadingComponent'
import { FolderOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons'

const Overview = () => {
    const [loading, setLoading] = useState(false)
    const [insights, setInsights] = useState<IInsights>()
    const fetchInsights = async () => {
        try {
            setLoading(true)
            const controller = new AbortController()
            const signal = controller.signal
            const { data } = await getInsights(signal)

            if (data) {
                setInsights(data)
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInsights()
    }, [])

    if (loading) {
        return <LoadingComponent />
    }
    return (
        <div className="flex flex-col gap-6 w-full p-4 font-sans">
            <h2 className="font-sans text-2xl font-semibold text-primary mb-4">Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* Total Categories */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FolderOutlined className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-sans text-xl font-semibold text-primary">Total Categories</h3>
                        <p className="font-sans text-gray-500 text-2xl font-bold">{insights?.categories ?? 0}</p>
                    </div>
                </div>

                {/* Total Articles */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                        <FileTextOutlined className="text-green-600 text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-sans text-xl font-semibold text-primary">Total Articles</h3>
                        <p className="font-sans text-gray-500 text-2xl font-bold">{insights?.articles ?? 0}</p>
                    </div>
                </div>

                {/* Total Users */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <UserOutlined className="text-purple-600 text-2xl" />
                    </div>
                    <div>
                        <h3 className="font-sans text-xl font-semibold text-primary">Total Users</h3>
                        <p className="font-sans text-gray-500 text-2xl font-bold">{insights?.users ?? 0}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview
