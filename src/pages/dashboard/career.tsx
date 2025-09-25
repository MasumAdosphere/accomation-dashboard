'use client'

import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Form, Input, message, Select, Switch, Table, Tooltip } from 'antd'
import { DeleteCareerModal } from '../../components/antdesign/modal.components'
import { EConfigButtonType, ICareer } from '../../types/state.types'
import { getAllCareers, publishCareerById } from '../../redux/career/career.thunk'
import { CreateCareerDrawer, EditCareerDrawer } from '../../components/antdesign/drawer.components'
import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
const Career = () => {
    const pageSize = 20
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // States
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalItems, setTotalItems] = useState(0)
    const [careers, setCareers] = useState<ICareer[]>([])
    const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null)
    const { isDataRefreshed, accessToken } = useSelector((state: RootState) => state.Common)
    const [isDeleteCareerModalOpen, setIsDeleteCareerModalOpen] = useState<boolean>(false)
    const [isCreateCareerDrawerOpen, setIsCreateCareerDrawerOpen] = useState<boolean>(false)
    const [isEditCareerDrawerOpen, setIsEditCareerDrawerOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('') // Filter by job role or location
    const controllerRef = useRef<AbortController | null>(null)

    const websiteUrl = import.meta.env.VITE_WEBSITE_URL

    // Options for employment type filter (optional — we'll use text search instead)
    const employmentTypeOptions = [
        { value: 'Full-time', label: 'Full-time' },
        { value: 'Part-time', label: 'Part-time' },
        { value: 'Contract', label: 'Contract' }
    ]

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
                <span className="font-sans text-sm 2xl:text-base font-medium">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Job Role',
            dataIndex: 'jobRole',
            width: '15%',
            key: 'jobRole',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record?.jobrole.length > 40 ? `${record.jobrole.slice(0, 40)}...` : record?.jobrole}
                </span>
            )
        },
        {
            title: 'Employment Type',
            dataIndex: 'employmentType',
            width: '10%',
            key: 'employmentType',
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium capitalize">{record.employmentType}</span>
        },
        {
            title: 'Location',
            dataIndex: 'location',
            width: '15%',
            key: 'location',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record.location.length > 40 ? `${record.location.slice(0, 40)}...` : record.location}
                </span>
            )
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            width: '12%',
            key: 'experience',
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record.experience}</span>
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: '20%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-sm 2xl:text-base font-bold">{moment(record.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (record) => (
                <div className="flex justify-start items-center gap-5">
                    <Tooltip title={record?.isLive ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isLive}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.id, checked)
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Edit">
                        <div
                            className="flex cursor-pointer gap-2 bg-primary py-3 px-6 font-medium text-white rounded-[50px] item-center justify-center"
                            onClick={() => {
                                setIsEditCareerDrawerOpen(true)
                                setSelectedCareerId(record.id)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                            />
                            <h6>Edit</h6>
                        </div>
                        {/* <EditFilled
                            onClick={() => {
                                setIsEditCareerDrawerOpen(true)
                                setSelectedCareerId(record.id)
                            }}
                            className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                    <Tooltip title="Delete">
                        <div
                            className="w-6 cursor-pointer h-6"
                            onClick={() => {
                                setIsDeleteCareerModalOpen(true)
                                setSelectedCareerId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
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

    const handleFilterChange = (value: string) => {
        setFilter(value)
        setPage(1)
    }

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Add Button */}
                    <div className="w-full sm:w-auto">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => setIsCreateCareerDrawerOpen(true)}
                                className="font-sans text-sm 2xl:text-lg rounded w-full sm:w-28 2xl:w-[153px] h-8 2xl:h-[46px] bg-primary text-white border-primary"
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
                        fontFamily: 'Inter, sans-serif',
                        fontWeightStrong: 500,
                        colorPrimary: '#816348',
                        fontSize: 16
                    },
                    components: {
                        Table: {
                            headerBg: '#F0F3F4',
                            headerColor: '#000'
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
