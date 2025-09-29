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
import editIcon from '../../assets/edit.svg'
import { CreateCategoryDrawer, EditCategoryDrawer } from '../../components/antdesign/drawer.components'
import moment from 'moment-timezone'

const Categories = () => {
    const pageSize = 20
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [categories, setCategories] = useState<Array<ICategory>>([])

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState<boolean>(false)
    const [isCreateCategoryDrawerOpen, SetIsCreateCategoryDrawerOpen] = useState<boolean>(false)
    // const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState<boolean>(false)

    const [isEditCategoryDrawerOpen, SetIsEditCategoryDrawerOpen] = useState<boolean>(false)

    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState<boolean>(false)

    // columns for table
    const columns: ColumnsType<ICategory> = [
        {
            title: 'Sr no.',
            width: '10%',
            dataIndex: 'index',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className=" font-Metropolis font-medium text-font16 text-[#515151]">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Category Title',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (_, record) => <span className="font-sans text-darkblue font-semibold text-font16">{record?.title}</span>
        },
        {
            title: 'Created Date & Time',
            key: 'createdAt',
            width: '20%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className=" font-Metropolis font-medium text-font16 text-[#515151]">
                    {moment.utc(record?.createdAt).utcOffset(330).format('DD-MM-YYYY | hh:mm A')}
                </span>
            )
        },
        // {
        //     title: 'Feature',
        //     dataIndex: 'feature',
        //     key: 'feature',
        //     width: '35%',
        //     render: (_, record) => <span className="font-sans text-sm 2xl:text-base font-medium">{record.feature}</span>
        // },

        {
            title: 'Actions',
            key: 'action',
            width: '20%',
            render: (_text: string, record) => (
                <div className="flex justify-start items-center gap-2">
                    <Tooltip title="Delete">
                        <div
                            className="w-10 h-8 cursor-pointer"
                            onClick={() => {
                                setIsDeleteCategoryModalOpen(true)
                                setSelectedCategoryId(record.id)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="w-10 h-8"
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
                    <Tooltip title="Edit">
                        <div
                            className="flex  cursor-pointer gap-[6px] w-[80px] h-[32px] bg-primary  justify-center items-center rounded-[50px] "
                            onClick={() => {
                                setSelectedCategory(record)
                                SetIsEditCategoryDrawerOpen(true)
                                console.log('Record', record.id)
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
                            SetIsCreateCategoryDrawerOpen(true)
                        }}
                        type="default"
                        className=" rounded-[25px] text-font16 font-semibold font-Metropolis  2xl:h-[48px] w-[160px] bg-primary text-white border-primary">
                        Add Category
                    </Button>
                </ButtonThemeConfig>
            </div>

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
                                headerColor: '#0E082B',
                                fontWeightStrong: 600
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
            {isCreateCategoryDrawerOpen && (
                <CreateCategoryDrawer
                    isCreateCategoryDrawerOpen={isCreateCategoryDrawerOpen}
                    SetIsCreateCategoryDrawerOpen={SetIsCreateCategoryDrawerOpen}
                />
            )}
            {isEditCategoryDrawerOpen && (
                <EditCategoryDrawer
                    categoryDetails={selectedCategory}
                    isEditCategoryDrawerOpen={isEditCategoryDrawerOpen}
                    SetIsEditCategoryDrawerOpen={SetIsEditCategoryDrawerOpen}
                />
            )}
        </div>
    )
}

export default Categories
