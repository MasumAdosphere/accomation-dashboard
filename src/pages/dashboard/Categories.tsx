import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { RootState } from '../../types/selector.types'
import { Table, Button, message, ConfigProvider, Tooltip } from 'antd'
import { getAllCategories } from '../../redux/category/category.thunk'
import { EConfigButtonType, ICategory } from '../../types/state.types'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { CreateNewCategoryModal, DeleteCategoryModal } from '../../components/antdesign/modal.components'
import deleteIcon from '../../assets/delete.svg'

const Categories = () => {
    const pageSize = 20
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [categories, setCategories] = useState<Array<ICategory>>([])
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState<boolean>(false)
    // const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false)
    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState<boolean>(false)

    // columns for table
    const columns: ColumnsType<ICategory> = [
        {
            title: 'Sr no.',
            width: '10%',
            dataIndex: 'index',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record?.title}</span>
        },
        {
            title: 'Feature',
            dataIndex: 'feature',
            key: 'feature',
            width: '35%',
            render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record.feature}</span>
        },

        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: (_text: string, record) => (
                <div className="flex justify-start items-center gap-5">
                    {/* <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            disabled={true}
                            type="default"
                            className="font-sans text-sm 2xl:text-base font-medium flex items-center"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setIsEditCategoryModalOpen(true)
                            }}>
                            Edit
                        </Button>
                    </ButtonThemeConfig> */}
                    <Tooltip title="Delete">
                        <div
                            className=""
                            onClick={() => {
                                setIsDeleteCategoryModalOpen(true)
                                setSelectedCategoryId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                            />
                        </div>
                        {/* <DeleteFilled
                            onClick={() => {
                                setIsDeleteCategoryModalOpen(true)
                                setSelectedCategoryId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        /> */}
                    </Tooltip>
                </div>
            )
        }
    ]

    // fetches all categories for table
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const controller = new AbortController()
            const signal = controller.signal
            const feature = ''
            const { data, meta } = await getAllCategories(pageSize, page, feature, signal)

            if (data) {
                setTotalPages(meta?.page.pages)
                setCategories(data)
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
        fetchCategories()
    }, [page, isDataRefreshed])
    return (
        <div>
            <div className="mb-4 flex justify-end items-center text-lg">
                {/* <h2 className="text-primary font-sans text-lg 2xl:text-font22 font-semibold">Categories</h2> */}

                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <Button
                        onClick={() => {
                            setIsNewCategoryModalOpen(true)
                        }}
                        type="default"
                        className="font-sans text-sm 2xl:text-lg rounded- h-8 2xl:h-[46px] bg-primary text-white border-primary">
                        Add Category
                    </Button>
                </ButtonThemeConfig>
            </div>

            <div className="font-sans">
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
                        dataSource={categories}
                        loading={loading}
                        columns={columns}
                        scroll={{ x: '900px' }}
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
            {isNewCategoryModalOpen && (
                <CreateNewCategoryModal
                    isNewCategoryModalOpen={isNewCategoryModalOpen}
                    setIsNewCategoryModalOpen={setIsNewCategoryModalOpen}
                />
            )}
            {isDeleteCategoryModalOpen && (
                <DeleteCategoryModal
                    selectedCategoryId={selectedCategoryId || ''}
                    isDeleteCategoryModalOpen={isDeleteCategoryModalOpen}
                    setIsDeleteCategoryModalOpen={setIsDeleteCategoryModalOpen}
                />
            )}
        </div>
    )
}

export default Categories
