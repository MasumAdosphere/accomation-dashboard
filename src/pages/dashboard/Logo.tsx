import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { ILogo, EConfigButtonType } from '../../types/state.types'
import { DeleteLogoModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, message, Switch, Table, Tooltip } from 'antd'
import { getAllLogo, publishLogoById } from '../../redux/logo/logo.thunk'
import { CreateLogoDrawer } from '../../components/antdesign/drawer.components'
import deleteIcon from '../../assets/delete.svg'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import plusicon from '../../assets/plus.svg'

const Logo = () => {
    const pageSize = 20
    const dispatch = useDispatch()

    // States
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [logos, setLogos] = useState<ILogo[]>([]) // 👈 Renamed from article
    const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null) // 👈 Renamed
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [isDeleteLogoModalOpen, setIsDeleteLogoModalOpen] = useState<boolean>(false) // 👈 Renamed
    const [isCreateLogoDrawerOpen, SetIsCreateLogoDrawerOpen] = useState<boolean>(false) // 👈 Renamed
    const controllerRef = useRef<AbortController | null>(null)

    const handleSwitchChange = async (id: string, checked: boolean) => {
        if (loading) return

        try {
            setLoading(true)

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            controllerRef.current = new AbortController()
            const signal = controllerRef.current.signal

            const data = await publishLogoById(id, checked, signal)

            if (data.success) {
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getLogos = async (signal: AbortSignal) => {
        try {
            setLoading(true)
            const { data } = await getAllLogo(pageSize, page, signal)
            if (data) {
                setLogos(data)
                console.log('Data', data)
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to load logos. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<ILogo> = [
        {
            title: 'Sr no.',
            dataIndex: 'index',
            width: '5%',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className="font-sans text-darkblue font-semibold text-font16">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
            key: 'name',
            render: (_, record) => (
                <span className="font-sans text-darkblue font-semibold text-font16">
                    {record?.companyName?.length > 40 ? `${record.companyName.slice(0, 40)}...` : record?.companyName}
                </span>
            )
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            width: '25%',
            key: 'logo',
            render: (_, record) => (
                <div className="flex items-center justify-start">
                    <img
                        src={record.logo}
                        alt={record.companyName}
                        crossOrigin="anonymous"
                        className="h-12 w-auto object-contain cursor-pointer rounded  transition-transform duration-200"
                    />
                </div>
            )
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: '15%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-darkblue font-semibold text-font16">{moment(record.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: (record) => (
                <div className="flex justify-start items-center gap-2">
                    <Tooltip title={record?.isLive ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isLive}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.id, checked)
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Delete">
                        <div
                            className=""
                            onClick={() => {
                                setIsDeleteLogoModalOpen(true)
                                setSelectedLogoId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="w-10 h-8"
                            />
                        </div>
                        {/* <DeleteFilled
                            onClick={() => {
                                setIsDeleteLogoModalOpen(true)
                                setSelectedLogoId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                </div>
            )
        }
    ]

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getLogos(signal)
        return () => {
            controller.abort()
        }
    }, [page, isDataRefreshed])

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="flex justify-end items-center text-lg">
                    <div>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => {
                                    SetIsCreateLogoDrawerOpen(true)
                                }}
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis  2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                Add Logo
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </div>
            </Form>

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
                    dataSource={logos}
                    loading={loading}
                    scroll={{ x: '1100px' }}
                    columns={columns}
                    rowHoverable={true}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        showSizeChanger: false,

                        onChange: (page: number) => {
                            setPage(page)
                        }
                    }}
                />
            </ConfigProvider>

            {isDeleteLogoModalOpen && (
                <DeleteLogoModal
                    isDeleteLogoModalOpen={isDeleteLogoModalOpen}
                    setIsDeleteLogoModalOpen={setIsDeleteLogoModalOpen}
                    selectedLogoId={selectedLogoId || ''}
                />
            )}
            {isCreateLogoDrawerOpen && (
                <CreateLogoDrawer
                    isCreateLogoDrawerOpen={isCreateLogoDrawerOpen}
                    SetIsCreateLogoDrawerOpen={SetIsCreateLogoDrawerOpen}
                />
            )}
        </div>
    )
}

export default Logo
