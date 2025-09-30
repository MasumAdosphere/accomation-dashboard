import moment from 'moment'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { EConfigButtonType, IUsers } from '../../types/state.types'
import { Table, message, ConfigProvider, Button, Tooltip } from 'antd'
import { fetchUsers } from '../../redux/user/user.thunk'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { CreateUserDrawer } from '../../components/antdesign/drawer.components'
import { useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import deleteIcon from '../../assets/delete.svg'
import { DeleteUserModal } from '../../components/antdesign/modal.components'

const Users = () => {
    const pageSize = 20
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [allUsers, setAllUsers] = useState<IUsers[]>([])
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const [isCreateUserDrawerOpen, SetIsCreateUserDrawerOpen] = useState<boolean>(false)

    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState<boolean>(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

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
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.email}</span>
        },

        {
            title: 'Created At',
            key: 'createdAt',
            width: 200,
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-sm text-gray44 font-medium">
                    {record?.lastLoginAt ? moment.utc(record.lastLoginAt).utcOffset(330).format('DD-MM-YYYY | hh:mm A') : 'Not logged in yet'}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-start items-center gap-2">
                    {/* <Tooltip title="Preview">
                        <Link
                            to={`${websiteUrl}/faq-preview/${record.slug}?accessToken=${accessToken}`}
                            target="_blank">
                            <EyeOutlined className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl" />
                        </Link>
                    </Tooltip> */}

                    <Tooltip title="Delete">
                        <div
                            className="w-10 h-8"
                            onClick={() => {
                                setIsDeleteUserModalOpen(true)
                                setSelectedUserId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="w-10 h-8"
                            />
                        </div>
                        {/* <DeleteFilled
                            onClick={() => {
                                setIsDeleteFaqModalOpen(true)
                                setSelectedFaqId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                    {/* <Tooltip title="Edit">
                        <div
                            className="flex  cursor-pointer gap-[6px] w-[80px] h-[32px] bg-primary  justify-center items-center rounded-[50px] "
                            onClick={() => {
                                setSelectedFaqId(record.id)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                            />
                            <h6 className="text-font15 leading-[100%] font-Metropolis font-semibold text-white">Edit</h6>{' '}
                        </div>
                    </Tooltip> */}
                </div>
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
    }, [page, isDataRefreshed])
    return (
        <div>
            <div className="font-sans">
                <div className="w-full flex flex-col justify-end gap-2 sm:w-auto">
                    <div
                        className="flex justify-end
                    ">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => SetIsCreateUserDrawerOpen(true)}
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis 2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                Add User
                            </Button>
                        </ButtonThemeConfig>
                    </div>
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
                                    headerColor: '#0E082B'
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
            {isCreateUserDrawerOpen && (
                <CreateUserDrawer
                    isCreateUserDrawerOpen={isCreateUserDrawerOpen}
                    SetIsCreateUserDrawerOpen={SetIsCreateUserDrawerOpen}
                />
            )}
            {isDeleteUserModalOpen && (
                <DeleteUserModal
                    isDeleteUserModalOpen={isDeleteUserModalOpen}
                    setIsDeleteUserModalOpen={setIsDeleteUserModalOpen}
                    selectedUserId={selectedUserId}
                />
            )}
        </div>
    )
}

export default Users
