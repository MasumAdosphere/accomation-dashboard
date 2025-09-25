import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons'
import { DeleteTestimonialModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, message, Switch, Table, Tooltip } from 'antd'
import { publishActionById } from '../../redux/article/article.thunk'
import { EConfigButtonType, ITestimonial } from '../../types/state.types'
import { getAllTestimonials, publishTestimonialById } from '../../redux/testimonials/testimonial.thunk'
import { CreateTestimonialDrawer, EditTestimonialDrawer } from '../../components/antdesign/drawer.components'

import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'

const Testimonial = () => {
    const pageSize = 20
    const navigate = useNavigate()
    const dispatch = useDispatch()
    //states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [testimonials, setTestimonials] = useState<ITestimonial[]>([])
    const [selectedTestimonialId, SetSelectedTestimonialId] = useState<string | null>(null)
    const { isDataRefreshed, accessToken } = useSelector((state: RootState) => state.Common)
    const [isDeleteTestimonialModalOpen, setIsDeleteTestimonialModalOpen] = useState<boolean>(false)

    const [isCreateTestimonialDrawerOpen, SetIsCreateTestimonialDrawerOpen] = useState<boolean>(false)
    const [isEditTestimonialDrawerOpen, SetIsEditTestimonialDrawerOpen] = useState<boolean>(false)

    const controllerRef = useRef<AbortController | null>(null)

    const websiteUrl = import.meta.env.VITE_WEBSITE_URL

    const handleSwitchChange = async (id: string, checked: boolean) => {
        if (loading) return

        try {
            setLoading(true)

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            controllerRef.current = new AbortController()
            const signal = controllerRef.current.signal

            const data = await publishTestimonialById(id, checked, signal)

            if (data.success) {
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<ITestimonial> = [
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
            title: 'Name',
            dataIndex: 'name',
            width: '10%',
            key: 'name',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record?.name?.length > 40 ? `${record?.name?.slice(0, 40)}...` : record?.name}
                </span>
            )
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            width: '20%',
            key: 'designation',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record?.designation?.length > 40 ? `${record?.designation?.slice(0, 40)}...` : record?.designation}
                </span>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '20%',
            key: 'description',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record?.description?.length > 30 ? `${record?.description.slice(0, 30)}...` : record?.description}
                </span>
            )
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: '20%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-sm 2xl:text-base font-bold">{moment(record?.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-center items-center gap-5">
                    <Tooltip title={record?.isPublished ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isPublished}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.id, checked)
                            }}
                        />
                    </Tooltip>
                    {/* <Tooltip title="Preview">
                        <Link
                            to={`${websiteUrl}/testimonial-preview/${record.slug}?accessToken=${accessToken}`}
                            target="_blank">
                            <EyeOutlined className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl">Open</EyeOutlined>
                        </Link>
                    </Tooltip> */}

                    <Tooltip title="Edit">
                        <div
                            className="flex cursor-pointer gap-2 bg-primary py-3 px-6 font-medium text-white rounded-[50px] item-center justify-center"
                            onClick={() => {
                                SetIsEditTestimonialDrawerOpen(true)
                                SetSelectedTestimonialId(record.id)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                            />
                            <h6>Edit</h6>
                        </div>
                        {/* <EditFilled
                            onClick={() => {
                                SetIsEditTestimonialDrawerOpen(true)
                                SetSelectedTestimonialId(record.id)
                            }}
                            className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                    <Tooltip title="Delete">
                        <div
                            className="h-6 w-6 cursor-pointer"
                            onClick={() => {
                                setIsDeleteTestimonialModalOpen(true)
                                SetSelectedTestimonialId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                            />
                        </div>
                        {/* <DeleteFilled
                            onClick={() => {
                                setIsDeleteTestimonialModalOpen(true)
                                SetSelectedTestimonialId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                </div>
            )
        }
    ]

    const getTestimonials = async (pageSize: number, page: number, signal: AbortSignal) => {
        try {
            setLoading(true)
            const { data, meta } = await getAllTestimonials(pageSize, page, signal)
            if (data) {
                setTotalPages(meta?.page.pages)
                setTestimonials(data)
            }
        } catch (error) {
            //@ts-ignore

            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getTestimonials(pageSize, page, signal)
        return () => {
            controller.abort()
        }
    }, [page, isDataRefreshed])

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex justify-end item-center text-lg">
                    {/* <Link to="/dashboard/testimonials/add"> */}
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => {
                                SetIsCreateTestimonialDrawerOpen(true)
                            }}
                            className="font-sans text-sm 2xl:text-lg rounded w-28 2xl:w-[153px] h-8 2xl:h-[46px] bg-primary text-white border-primary"
                            type="default">
                            Add Testimonial
                        </Button>
                    </ButtonThemeConfig>
                    {/* </Link> */}
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
                    dataSource={testimonials}
                    loading={loading}
                    scroll={{ x: '1100px' }}
                    columns={columns}
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
            {isDeleteTestimonialModalOpen && (
                <DeleteTestimonialModal
                    isDeleteTestimonialModalOpen={isDeleteTestimonialModalOpen}
                    setIsDeleteTestimonialModalOpen={setIsDeleteTestimonialModalOpen}
                    selectedTestimonialId={selectedTestimonialId || ''}
                />
            )}
            {isCreateTestimonialDrawerOpen && (
                <CreateTestimonialDrawer
                    isCreateTestimonialDrawerOpen={isCreateTestimonialDrawerOpen}
                    SetIsCreateTestimonialDrawerOpen={SetIsCreateTestimonialDrawerOpen}
                />
            )}
            {isEditTestimonialDrawerOpen && (
                <EditTestimonialDrawer
                    isEditTestimonialDrawerOpen={isEditTestimonialDrawerOpen}
                    SetIsEditTestimonialDrawerOpen={SetIsEditTestimonialDrawerOpen}
                    selectedTestimonialId={selectedTestimonialId || ''}
                />
            )}
        </div>
    )
}

export default Testimonial
