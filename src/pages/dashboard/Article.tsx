import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { ArticleData, EConfigButtonType } from '../../types/state.types'
import { DeleteFilled, EditFilled, EyeOutlined } from '@ant-design/icons'
import { DeleteArticleModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, message, Switch, Table, Tooltip } from 'antd'
import { getAllArticles, publishActionById } from '../../redux/article/article.thunk'
import { CreateArticleDrawer, EditArticleDrawer } from '../../components/antdesign/drawer.components'

const Article = () => {
    const pageSize = 20
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [article, setArticle] = useState<ArticleData[]>([])
    const [selectedArticleId, SetSelectedArticleId] = useState<string | null>(null)
    const { isDataRefreshed, accessToken } = useSelector((state: RootState) => state.Common)
    const [isDeleteArticleModalOpen, setIsDeleteArticleModalOpen] = useState<boolean>(false)
    const [isCreateArticleDrawerOpen, SetIsCreateArticleDrawerOpen] = useState<boolean>(false)
    const [isEditArticleDrawerOpen, SetIsEditArticleDrawerOpen] = useState<boolean>(false)
    const controllerRef = useRef<AbortController | null>(null)

    const websiteUrl = import.meta.env.VITE_WEBSITE_URL

    const handleSwitchChange = async (slug: string, checked: boolean) => {
        if (loading) return

        try {
            setLoading(true)

            if (controllerRef.current) {
                controllerRef.current.abort()
            }

            controllerRef.current = new AbortController()
            const signal = controllerRef.current.signal

            const data = await publishActionById(slug, checked, signal)

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
                <span className="font-sans text-sm 2xl:text-base font-medium">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: '25%',
            key: 'title',
            render: (_, record) => (
                <span className="font-sans text-sm 2xl:text-base font-medium">
                    {record.title.length > 40 ? `${record.title.slice(0, 40)}...` : `${record.title}`}
                </span>
            )
        },

        {
            title: 'Category',
            key: 'category',
            width: '10%',
            dataIndex: 'category',
            render: (_text: string, record: any) => <span className="font-sans text-sm 2xl:text-base font-semibold">{record?.category?.title}</span>
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: '10%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className="font-sans text-sm 2xl:text-base font-semibold">{moment(record?.createdAt).format('DD-MM-YYYY HH:mm A')}</span>
            )
        },

        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-start items-center gap-5">
                    <Tooltip title={record?.isPublished ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isPublished}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.slug, checked)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Preview">
                        <Link
                            to={`${websiteUrl}/article-preview/${record.slug}?accessToken=${accessToken}`}
                            target="_blank">
                            <EyeOutlined className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl">Open</EyeOutlined>
                        </Link>
                    </Tooltip>

                    <Tooltip title="Edit">
                        <EditFilled
                            onClick={() => {
                                SetIsEditArticleDrawerOpen(true)
                                SetSelectedArticleId(record.id)
                            }}
                            className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteFilled
                            onClick={() => {
                                setIsDeleteArticleModalOpen(true)
                                SetSelectedArticleId(record.id)
                            }}
                            className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl"
                        />
                    </Tooltip>
                </div>
            )
        }
    ]

    const getArticles = async (signal: AbortSignal) => {
        try {
            setLoading(true)

            const { data, meta } = await getAllArticles(pageSize, page, signal)
            if (data) {
                setTotalPages(meta?.page.pages)
                setArticle(data)
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
        getArticles(signal)
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, isDataRefreshed])

    return (
        <div className="font-sans space-y-3">
            <Form>
                <div className="mb-4 flex justify-end items-center text-lg">
                    {/* <h2 className="text-primary font-sans text-lg 2xl:text-font22 font-semibold">Articles</h2> */}
                    <div>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => SetIsCreateArticleDrawerOpen(true)}
                                className="font-sans text-sm 2xl:text-lg rounded w-28 2xl:w-[153px] h-8 2xl:h-[46px] bg-primary text-white border-primary"
                                type="default">
                                Add Article
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
                        // borderRadius: 0
                    },
                    components: {
                        Table: {
                            headerBg: '#816348',
                            headerColor: '#fff'
                        }
                    }
                }}>
                <Table
                    dataSource={article}
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
            {isDeleteArticleModalOpen && (
                <DeleteArticleModal
                    isDeleteArticleModalOpen={isDeleteArticleModalOpen}
                    setIsDeleteArticleModalOpen={setIsDeleteArticleModalOpen}
                    selectedArticleId={selectedArticleId || ''}
                />
            )}
            {isCreateArticleDrawerOpen && (
                <CreateArticleDrawer
                    isCreateArticleDrawerOpen={isCreateArticleDrawerOpen}
                    SetIsCreateArticleDrawerOpen={SetIsCreateArticleDrawerOpen}
                />
            )}

            <EditArticleDrawer
                isEditArticleDrawerOpen={isEditArticleDrawerOpen}
                SetIsEditArticleDrawerOpen={SetIsEditArticleDrawerOpen}
                selectedArticleId={selectedArticleId || ''}
            />
        </div>
    )
}

export default Article
