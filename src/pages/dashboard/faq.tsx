import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
// import { DeleteFaqModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, message, Select, Switch, Table, Tooltip } from 'antd'
import { EConfigButtonType, IFaq } from '../../types/state.types'
import { getAllFaqs, publishFaqById, updateFaqSequences } from '../../redux/faq/faq.thunk'
import { DeleteFaqModal } from '../../components/antdesign/modal.components'
import { CreateFaqDrawer, EditFaqDrawer } from '../../components/antdesign/drawer.components'
import type { DragEndEvent } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'

import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'
import dragIcon from '../../assets/drag_indicator.svg'
import { LoadingOutlined } from '@ant-design/icons'

const Row: React.FC<Readonly<RowProps>> = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key']
    })

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'move',
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
    }

    return (
        <tr
            {...props}
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        />
    )
}
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string
}

const Faq = () => {
    const pageSize = 20
    const dispatch = useDispatch()

    // States
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [faqs, setFaqs] = useState<IFaq[]>([])
    const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [isDeleteFaqModalOpen, setIsDeleteFaqModalOpen] = useState<boolean>(false)
    const [isCreateFaqDrawerOpen, SetIsCreateFaqDrawerOpen] = useState<boolean>(false)
    const [isEditFaqDrawerOpen, SetIsEditFaqDrawerOpen] = useState<boolean>(false)
    const [pageName, setPageName] = useState<string>('Overview')
    const controllerRef = useRef<AbortController | null>(null)

    // Options for dropdown
    const pageNameOptions = [
        { value: 'Overview', label: 'Overview' },
        { value: 'Blog', label: 'Blog' },
        { value: 'Testimonial', label: 'Testimonial' }
    ]
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSwitchChange = async (id: string, checked: boolean) => {
        if (loading) return

        try {
            setLoading(true)

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            controllerRef.current = new AbortController()
            const signal = controllerRef.current.signal

            const data = await publishFaqById(id, checked, signal)

            if (data.success) {
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<IFaq> = [
        {
            title: '',
            dataIndex: 'index',
            width: '5%',
            key: 'index',
            render: (_text: string, _record: any) => (
                <img
                    src={dragIcon}
                    alt="drag"
                    className="w-6 h-6 cursor-move"
                />
            )
        },

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
            title: 'Question',
            dataIndex: 'question',
            width: '25%',
            key: 'question',
            render: (_, record) => (
                <span className="font-sans text-darkblue font-semibold text-font16">
                    {record?.question?.length > 40 ? `${record?.question?.slice(0, 40)}...` : record?.question}
                </span>
            )
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            width: '35%',
            key: 'answer',
            render: (_, record) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">
                    {record?.answer?.length > 40 ? `${record?.answer?.slice(0, 40)}...` : record?.answer}
                </span>
            )
        },
        {
            title: 'Page Name',
            dataIndex: 'pageName',
            width: '10%',
            key: 'pageName',
            render: (_, record) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151] capitalize">{record?.pageName || 'N/A'}</span>
            )
        },
        {
            title: 'Created Date & Time',
            key: 'createdAt',
            width: '20%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">
                    {moment.utc(record?.createdAt).utcOffset(330).format('DD-MM-YYYY | hh:mm A')}
                </span>
            )
        },
        {
            title: 'Actions',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-start items-center gap-2">
                    <Tooltip title={record?.isPublished ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isPublished}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.slug, checked)
                            }}
                        />
                    </Tooltip>
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
                                setIsDeleteFaqModalOpen(true)
                                setSelectedFaqId(record.id)
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
                    <Tooltip title="Edit">
                        <div
                            className="flex  cursor-pointer gap-[6px] w-[80px] h-[32px] bg-primary  justify-center items-center rounded-[50px] "
                            onClick={() => {
                                SetIsEditFaqDrawerOpen(true)
                                setSelectedFaqId(record.id)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                            />
                            <h6 className="text-font15 leading-[100%] font-Metropolis font-semibold text-white">Edit</h6>{' '}
                        </div>
                        {/* <EditFilled
                            onClick={() => {
                                SetIsEditFaqDrawerOpen(true)
                                setSelectedFaqId(record.id)
                            }}
                            className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                </div>
            )
        }
    ]

    const getFaqs = async (pageNameParam: string, signal: AbortSignal) => {
        try {
            setLoading(true)
            const res = await getAllFaqs(pageNameParam, signal) // 👈 Pass pageName as third param
            if (res.data) {
                console.log('res', res.data)
                setFaqs(res.data)
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to load FAQs. Please try again.',
                duration: 8
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getFaqs(pageName, signal)

        return () => {
            controller.abort()
        }
    }, [page, pageName, isDataRefreshed])

    const handlePageNameChange = (value: string) => {
        setPageName(value)
        setPage(1) // Reset to page 1 when filter changes
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1
            }
        })
    )
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return

        const activeIndex = faqs.findIndex((item) => item.id === active.id)
        const overIndex = faqs.findIndex((item) => item.id === over.id)

        if (activeIndex === -1 || overIndex === -1) return

        const newFaqs = arrayMove(faqs, activeIndex, overIndex)

        const updatedFaqs = newFaqs.map((item, index) => ({
            ...item,
            sequenceId: index + 1
        }))

        setFaqs(updatedFaqs)
    }

    const handleSaveChanges = async () => {
        try {
            setIsSubmitting(true)
            const payload = faqs.map((faq, index) => ({
                id: faq.id,
                sequenceId: index + 1
            }))

            await updateFaqSequences(payload)
            message.success('Sequence updated successfully!')
        } catch (err) {
            message.error('Failed to update sequence')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Filter Dropdown */}
                    <div className="w-full sm:w-auto">
                        <Select
                            placeholder="Filter by Category"
                            value={pageName}
                            onChange={handlePageNameChange}
                            options={pageNameOptions}
                            style={{ width: '256px', height: '48px', borderRadius: '8px', border: '1px solid #DDDDDD' }}
                            className="font-sans text-font16 text-[#1c1c1c] font-semibold w-full"
                            allowClear
                        />
                    </div>

                    {/* Add Button */}
                    <div className="w-full flex gap-2 sm:w-auto">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={handleSaveChanges}
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined} // show loader
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis  2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </ButtonThemeConfig>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => SetIsCreateFaqDrawerOpen(true)}
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis  2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                Add FAQ
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
                <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={onDragEnd}>
                    <SortableContext
                        // rowKey array
                        items={faqs.map((i) => i.id)}
                        strategy={verticalListSortingStrategy}>
                        <Table
                            components={{
                                body: { row: Row }
                            }}
                            dataSource={faqs}
                            loading={loading}
                            scroll={{ x: '1100px' }}
                            columns={columns}
                            rowHoverable={true}
                            rowKey={(record) => record.id}
                        />
                    </SortableContext>
                </DndContext>
            </ConfigProvider>

            {isDeleteFaqModalOpen && (
                <DeleteFaqModal
                    isDeleteFaqModalOpen={isDeleteFaqModalOpen}
                    setIsDeleteFaqModalOpen={setIsDeleteFaqModalOpen}
                    selectedFaqId={selectedFaqId || ''}
                />
            )}
            {isCreateFaqDrawerOpen && (
                <CreateFaqDrawer
                    isCreateFaqDrawerOpen={isCreateFaqDrawerOpen}
                    SetIsCreateFaqDrawerOpen={SetIsCreateFaqDrawerOpen}
                />
            )}
            {isEditFaqDrawerOpen && (
                <EditFaqDrawer
                    isEditFaqDrawerOpen={isEditFaqDrawerOpen}
                    SetIsEditFaqDrawerOpen={SetIsEditFaqDrawerOpen}
                    selectedFaqId={selectedFaqId || ''}
                />
            )}
        </div>
    )
}

export default Faq
