import moment from 'moment'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { ArticleData, EConfigButtonType } from '../../types/state.types'
import { DeleteArticleModal } from '../../components/antdesign/modal.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { Button, ConfigProvider, Form, message, Switch, Table, Tooltip } from 'antd'
import { getAllArticles, publishActionById } from '../../redux/article/article.thunk'
import { CreateArticleDrawer, EditArticleDrawer } from '../../components/antdesign/drawer.components'

import deleteIcon from '../../assets/delete.svg'
import editIcon from '../../assets/edit.svg'
import plusicon from '../../assets/plus.svg'

const Article = () => {
    const pageSize = 20
    const dispatch = useDispatch()
    // states
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [article, setArticle] = useState<ArticleData[]>([])
    const [selectedArticle, SetSelectedArticle] = useState<ArticleData | null>(null)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [isDeleteArticleModalOpen, setIsDeleteArticleModalOpen] = useState<boolean>(false)
    const [isCreateArticleDrawerOpen, SetIsCreateArticleDrawerOpen] = useState<boolean>(false)
    const [isEditArticleDrawerOpen, SetIsEditArticleDrawerOpen] = useState<boolean>(false)
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
                <span className=" font-Metropolis font-medium text-font16 text-[#515151]">{(page - 1) * pageSize + index + 1}</span>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: '25%',
            key: 'title',
            render: (_, record) => (
                <span className="font-sans text-darkblue font-semibold text-font16">
                    {record.title.length > 40 ? `${record.title.slice(0, 40)}...` : `${record.title}`}
                </span>
            )
        },

        {
            title: 'Category',
            key: 'category',
            width: '10%',
            dataIndex: 'category',
            render: (_text: string, record: any) => (
                <span className=" font-Metropolis font-semibold text-font16 text-darkblue px-3 py-[6px] rounded-[100px] bg-[#FFDE39]">
                    {record?.category?.title}
                </span>
            )
        },
        {
            title: 'Created At',
            key: 'createdAt',
            width: '10%',
            dataIndex: 'createdAt',
            render: (_text: string, record: any) => (
                <span className=" font-Metropolis font-medium text-font16 text-[#515151]">
                    {moment(record?.createdAt).format('DD-MM-YYYY HH:mm A')}
                </span>
            )
        },

        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (record) => (
                <div className="flex justify-start items-center gap-5">
                    <Tooltip title={record?.isFeatured ? 'Unpublish' : 'Publish'}>
                        <Switch
                            checked={record?.isFeatured}
                            disabled={loading}
                            onChange={async (checked) => {
                                handleSwitchChange(record?.id, checked)
                            }}
                        />
                    </Tooltip>
                    {/* <Tooltip title="Preview">
                        <Link
                            to={`${websiteUrl}/article-preview/${record.slug}?accessToken=${accessToken}`}
                            target="_blank">
                            <EyeOutlined className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl">Open</EyeOutlined>
                        </Link>
                    </Tooltip> */}

                    <Tooltip title="Delete">
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                setIsDeleteArticleModalOpen(true)
                                SetSelectedArticle(record)
                            }}>
                            <img
                                src={deleteIcon}
                                alt=""
                                className="w-10 h-8"
                            />
                        </div>
                        {/* <DeleteFilled className="text-red-500 hover:text-secondary cursor-pointer text-lg 2xl:text-2xl" /> */}
                    </Tooltip>
                    <Tooltip title="Edit">
                        <div
                            className="flex gap-2 cursor-pointer bg-primary py-2 px-4 font-medium text-white rounded-[50px] item-center justify-center"
                            onClick={() => {
                                SetIsEditArticleDrawerOpen(true)
                                SetSelectedArticle(record)
                            }}>
                            <img
                                src={editIcon}
                                alt=""
                            />
                            <h6>Edit</h6>
                        </div>
                        {/* <EditFilled className="text-primary hover:text-secondary cursor-pointer text-lg 2xl:text-2xl" /> */}
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
                                className="font-sans rounded-[40px] text-sm 2xl:text-lg  w-28 2xl:w-[153px] h-8 2xl:h-[46px] bg-primary text-white border-primary"
                                type="default">
                                <img
                                    src={plusicon}
                                    alt=""
                                />
                                Add Article
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
                        // borderRadius: 0
                    },
                    components: {
                        Table: {
                            headerBg: '#FFEBFB',
                            headerColor: '#000'
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
                    selectedArticleId={selectedArticle ? selectedArticle.id : ''}
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
                articleDetails={selectedArticle}
            />
        </div>
    )
}

export default Article
