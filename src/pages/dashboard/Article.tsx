import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { ArticleData, EConfigButtonType, ICategory } from '../../types/state.types'
import { DeleteArticleModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, Input, message, Select, Switch, Table, Tooltip } from 'antd'
import { getAllArticles, publishActionById } from '../../redux/article/article.thunk'
import { CreateArticleDrawer, EditArticleDrawer } from '../../components/antdesign/drawer.components'
import { getAllCategories } from '../../redux/category/category.thunk' // 👈 Import the thunk

import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'
import { TextItem } from '../../components/antdesign/form.components'
import searchIcon from '../../assets/search.svg'

const Article = () => {
    const pageSize = 20
    const dispatch = useDispatch()

    // States
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [articles, setArticles] = useState<ArticleData[]>([])
    const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [isDeleteArticleModalOpen, setIsDeleteArticleModalOpen] = useState<boolean>(false)
    const [isCreateArticleDrawerOpen, setIsCreateArticleDrawerOpen] = useState<boolean>(false)
    const [isEditArticleDrawerOpen, setIsEditArticleDrawerOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [categories, setCategories] = useState<ICategory[]>([]) // 👈 store categories
    const controllerRef = useRef<AbortController | null>(null)

    // 🔁 Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const controller = new AbortController()
                const signal = controller.signal
                const res = await getAllCategories(1000, 1, '', signal) // fetch all categories
                if (res.data) {
                    setCategories(res.data)
                }
            } catch (error) {
                console.error('Failed to load categories:', error)
            }
        }

        fetchCategories()
    }, [])
    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleSwitchChange = async (id: string, checked: boolean) => {
        if (loading) return

        try {
            setLoading(true)

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            controllerRef.current = new AbortController()
            const signal = controllerRef.current.signal

            const data = await publishActionById(id, checked, signal)

            if (data.success) {
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<ArticleData> = [
        {
            title: 'Sr no.',
            dataIndex: 'index',
            width: '5%',
            key: 'index',
            render: (_text: string, _record: any, index: number) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Blog Title',
            dataIndex: 'title',
            width: '25%',
            key: 'title',
            render: (_, record) => (
                <span className="font-sans text-darkblue font-semibold text-font16">
                    {record.title.length > 40 ? `${record.title.slice(0, 40)}...` : record.title}
                </span>
            )
        },
        {
            title: 'Category',
            key: 'category',
            width: '10%',
            dataIndex: 'category',
            render: (_text: string, record: any) => (
                <span className="font-Metropolis font-semibold text-font16 text-darkblue px-3 py-[6px] rounded-[100px] bg-[#FFDE39]">
                    {record?.category?.title || 'N/A'}
                </span>
            )
        },
        {
            title: 'Last Updated',
            key: 'createdAt',
            width: '10%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-Metropolis font-medium text-font16 text-[#515151]">
                    {moment.utc(record?.createdAt).utcOffset(330).format('DD-MM-YYYY | hh:mm A')}
                </span>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-start items-center gap-2">
                    <Tooltip title={record?.isFeatured ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isFeatured}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.id, checked)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setIsDeleteArticleModalOpen(true)
                                setSelectedArticle(record)
                            }}>
                            <img
                                src={deleteIcon}
                                alt="Delete"
                                className="w-10 h-8"
                            />
                        </div>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <div
                            className="flex cursor-pointer gap-[6px] w-[80px] h-[32px] bg-primary justify-center items-center rounded-[50px]"
                            onClick={() => {
                                setIsEditArticleDrawerOpen(true)
                                setSelectedArticle(record)
                            }}>
                            <img
                                src={editIcon}
                                alt="Edit"
                            />
                            <h6 className="text-font15 leading-[100%] font-Metropolis font-semibold text-white">Edit</h6>
                        </div>
                    </Tooltip>
                </div>
            )
        }
    ]

    const getArticles = async (signal: AbortSignal) => {
        try {
            setLoading(true)
            const { data, meta } = await getAllArticles(pageSize, page, searchQuery, selectedCategory, signal) // 👈 pass selectedCategory as `feature`
            if (data) {
                setTotalPages(meta?.page.pages || 1)
                setArticles(data)
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to load articles. Please try again.',
                duration: 8
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getArticles(signal)
        return () => {
            controller.abort()
        }
    }, [page, selectedCategory, searchQuery, isDataRefreshed]) // 👈 re-fetch when category changes

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value)
        setPage(1) // reset to first page
    }

    // Prepare category options for Select
    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.title
    }))

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Category Filter Dropdown */}
                    <div className="w-full flex gap-3">
                        <div className="max-w-[350px] w-full">
                            <TextItem
                                placeholder="Search articles..."
                                value={searchQuery}
                                icon={
                                    <img
                                        src={searchIcon}
                                        alt="logout"
                                        className="w-3 h-3 mr-2 "
                                    />
                                }
                                onChange={(e) => setSearchQuery(e.target.value)}
                                allowClear
                                className="font-sans h-12 w-full text-font16 text-[#1c1c1c] font-semibold"
                                name={''}
                                required={false}
                            />
                        </div>
                        <div className="max-w-[256px] w-full">
                            <Select
                                placeholder="Filter by Category"
                                value={selectedCategory || undefined}
                                onChange={handleCategoryChange}
                                options={categoryOptions}
                                style={{ height: '48px', borderRadius: '8px', borderColor: '#DDDDDD' }}
                                className="font-sans text-font16 text-[#1c1c1c] font-semibold w-full"
                                allowClear
                            />
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="w-full flex gap-2 sm:w-auto">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => setIsCreateArticleDrawerOpen(true)}
                                className="rounded-[25px] text-font16 font-semibold font-Metropolis 2xl:h-[48px] w-[160px] bg-primary text-white border-primary"
                                type="default">
                                Add Blog
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
                    dataSource={articles}
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
                        onChange: setPage
                    }}
                />
            </ConfigProvider>

            {isDeleteArticleModalOpen && (
                <DeleteArticleModal
                    isDeleteArticleModalOpen={isDeleteArticleModalOpen}
                    setIsDeleteArticleModalOpen={setIsDeleteArticleModalOpen}
                    selectedArticleId={selectedArticle?.id || ''}
                />
            )}
            {isCreateArticleDrawerOpen && (
                <CreateArticleDrawer
                    isCreateArticleDrawerOpen={isCreateArticleDrawerOpen}
                    SetIsCreateArticleDrawerOpen={setIsCreateArticleDrawerOpen}
                />
            )}
            {isEditArticleDrawerOpen && (
                <EditArticleDrawer
                    isEditArticleDrawerOpen={isEditArticleDrawerOpen}
                    SetIsEditArticleDrawerOpen={setIsEditArticleDrawerOpen}
                    articleDetails={selectedArticle}
                />
            )}
        </div>
    )
}

export default Article
