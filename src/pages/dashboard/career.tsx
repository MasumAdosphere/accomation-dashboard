import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { Button, ConfigProvider, Form, message, Switch, Table, Tooltip } from 'antd'
import { DeleteCareerModal } from '../../components/antdesign/modal.components'
import { EConfigButtonType, ICareer } from '../../types/state.types'
import { getAllCareers, publishCareerById } from '../../redux/career/career.thunk'
import { CreateCareerDrawer, EditCareerDrawer } from '../../components/antdesign/drawer.components'
import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import plusicon from '../../assets/plus.svg'

const Career = () => {
    const pageSize = 20
    const dispatch = useDispatch()

    // States
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [careers, setCareers] = useState<ICareer[]>([])
    const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [isDeleteCareerModalOpen, setIsDeleteCareerModalOpen] = useState<boolean>(false)
    const [isCreateCareerDrawerOpen, setIsCreateCareerDrawerOpen] = useState<boolean>(false)
    const [isEditCareerDrawerOpen, setIsEditCareerDrawerOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('')
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

            const data = await publishCareerById(id, checked, signal)

            if (data.success) {
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<ICareer> = [
        {
            title: 'Sr.',
            dataIndex: 'index',
            width: '5%',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Job Role',
            dataIndex: 'jobRole',
            width: '15%',
            key: 'jobRole',
            render: (_, record) => (
                <span className="font-sans text-darkblue font-semibold text-font16">
                    {record?.jobrole.length > 40 ? `${record.jobrole.slice(0, 40)}...` : record?.jobrole}
                </span>
            )
        },
        {
            title: 'Employment Type',
            dataIndex: 'employmentType',
            width: '20%',
            key: 'employmentType',
            render: (_, record) => <span className="font-Metropolis font-medium text-font16 text-[#515151] capitalize">{record.employmentType}</span>
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '15%',
            key: 'location',
            render: (_, record) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">
                    {record.location.length > 40 ? `${record.location.slice(0, 40)}...` : record.location}
                </span>
            )
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            width: '12%',
            key: 'experience',
            render: (_, record) => <span className="font-Metropolis font-medium text-font16 text-[#515151]">{record.experience}</span>
        },
        {
            title: 'Created Date & Time',
            key: 'createdAt',
            width: '18%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">
                    {moment(record.createdAt).format('DD-MM-YYYY HH:mm A')}
                </span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
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
                            className="w-10 h-8 cursor-pointer "
                            onClick={() => {
                                setIsDeleteCareerModalOpen(true)
                                setSelectedCareerId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="w-10 h-8"
                            />
                        </div>
                        {/* <DeleteFilled
                            onClick={() => {
                                setIsDeleteCareerModalOpen(true)
                                setSelectedCareerId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                    <Tooltip title="Edit">
                        <div
                            className="flex  cursor-pointer gap-[6px] w-[80px] h-[32px] bg-primary  justify-center items-center rounded-[50px] "
                            onClick={() => {
                                setIsEditCareerDrawerOpen(true)
                                setSelectedCareerId(record.id)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                                className="h-3 w-3"
                            />
                            <h6 className="text-font15 leading-[100%] font-Metropolis font-semibold text-white">Edit</h6>{' '}
                        </div>
                        {/* <EditFilled
                            onClick={() => {
                                setIsEditCareerDrawerOpen(true)
                                setSelectedCareerId(record.id)
                            }}
                            className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                </div>
            )
        }
    ]

    const getCareers = async (signal: AbortSignal) => {
        try {
            setLoading(true)
            const res = await getAllCareers(filter, signal)

            console.log('✅ Career data:', res.data)

            setCareers(res.data || [])
            setTotalItems(res.meta?.total || 0)
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to load careers. Please try again.',
                duration: 8
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getCareers(signal)

        return () => {
            controller.abort()
        }
    }, [page, filter, isDataRefreshed])

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                    {/* Add Button */}
                    <div className="w-full sm:w-auto">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => setIsCreateCareerDrawerOpen(true)}
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis  2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                Add Career
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
                    dataSource={careers}
                    loading={loading}
                    scroll={{ x: '1300px' }}
                    columns={columns}
                    rowHoverable={true}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        showSizeChanger: false,
                        total: totalItems,
                        onChange: (page: number) => {
                            setPage(page)
                        }
                    }}
                />
            </ConfigProvider>

            {isDeleteCareerModalOpen && (
                <DeleteCareerModal
                    isDeleteCareerModalOpen={isDeleteCareerModalOpen}
                    setIsDeleteCareerModalOpen={setIsDeleteCareerModalOpen}
                    selectedCareerId={selectedCareerId || ''}
                />
            )}

            {isCreateCareerDrawerOpen && (
                <CreateCareerDrawer
                    isCreateCareerDrawerOpen={isCreateCareerDrawerOpen}
                    SetIsCreateCareerDrawerOpen={setIsCreateCareerDrawerOpen}
                />
            )}

            {isEditCareerDrawerOpen && (
                <EditCareerDrawer
                    isEditCareerDrawerOpen={isEditCareerDrawerOpen}
                    SetIsEditCareerDrawerOpen={setIsEditCareerDrawerOpen}
                    selectedCareerId={selectedCareerId || ''}
                />
            )}
        </div>
    )
}

export default Career
