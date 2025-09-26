import moment from 'moment'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { IUsers } from '../../types/state.types'
import { Table, message, ConfigProvider } from 'antd'
import { fetchUsers } from '../../redux/user/user.thunk'

const Users = () => {
    const pageSize = 20
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [allUsers, setAllUsers] = useState<IUsers[]>([])

    // columns for table
    const columns: ColumnsType<IUsers> = [
        {
            title: 'Sr no.',
            width: 80,
            dataIndex: 'index',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.name}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.emailAddress}</span>
        },
        {
            title: 'Verification Status',
            dataIndex: 'verification',
            key: 'verification',
            width: 200,
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.verification.status ? 'Yes' : 'No'}</span>
        },
        {
            title: 'WhatsApp Number',
            dataIndex: 'whatsAppNumber',
            key: 'whatsAppNumber',
            width: 200,
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.whatsAppNumber}</span>
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: 200,
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-sm 2xl:text-base font-semibold">{moment(record?.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
            )
        }
    ]

    const fetchAllUsers = async () => {
        try {
            setLoading(true)
            const controller = new AbortController()
            const signal = controller.signal
            const { data, meta } = await fetchUsers(signal, page, pageSize)

            if (data) {
                setTotalPages(meta?.page.pages)
                setAllUsers(data)
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
        fetchAllUsers()
    }, [page])
    return (
        <div>
            <div className="font-sans">
                <ConfigProvider
                    theme={{
                        token: {
                            fontFamily: 'Metropolis, sans-serif',
                            fontWeightStrong: 600,
                            colorPrimary: '#4226C4',
                            fontSize: 16
                        },
                        components: {
                            Table: {
                                headerBg: '#FFEBFB',
                                headerColor: '#000'
                            }
                        }
                    }}>
                    <Table
                        dataSource={allUsers}
                        loading={loading}
                        columns={columns}
                        scroll={{ x: '1300' }}
                        rowHoverable={true}
                        rowKey={(record) => record.id}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            showSizeChanger: false,
                            total: totalPages * pageSize,
                            onChange: (page: number) => {
                                setPage(page)
                            }
                        }}
                    />
                </ConfigProvider>
            </div>
        </div>
    )
}

export default Users
