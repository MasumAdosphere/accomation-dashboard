import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, Form, message, Select } from 'antd'
import { EConfigButtonType, ICategory } from '../../types/state.types'
import { getAllCategories } from '../../redux/category/category.thunk'
import { audioBoxRegex, urlRegex, videoRegex } from '../../quicker/quicker'
import { createArticle, uploadFileUrl } from '../../redux/article/article.thunk'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { SubmitButton, TextEditor, TextItem, UploadImgFile } from '../../components/antdesign/form.components'
import { type } from 'os'

const CreateArticle = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null)
    const [uploadImage, setUploadImage] = useState<string | null>(null)
    const [categories, setCategories] = useState<Array<ICategory>>([])

    const combinedRegex = new RegExp(`${audioBoxRegex.source}|${videoRegex.source}`, 'i')

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        if (name === 'slug') {
            value = generateSlug(value)
        }
        form.setFieldsValue({ [name]: value })
    }
    const generateSlug = (title: string) => {
        let baseTitle = title.toLowerCase().replace(/\s+/g, '-')
        let removeExtra = baseTitle.replace(/[^a-z0-9-]/g, '')
        let collapsedHyphens = removeExtra.replace(/-+/g, '-')
        return collapsedHyphens
    }
    const submitBtnHandler = async () => {
        try {
            const values = await form.validateFields()
            const payload = {
                title: values.title,
                slug: values.slug,
                category: values.category,
                headingVideo: values.headingVideo,
                content: values.content || '',
                shabad: uploadImage,
                thumbnail: uploadThumbnail,
                audioCard: (values.audioCards || []).map((card: any) => ({
                    title: card.title,
                    link: card.link
                })),
                externalLink: (values.linkCards || []).map((card: any) => ({
                    title: card.title,
                    link: card.link
                }))
            }

            const success = await createArticle(payload)
            if (success) {
                setUploadImage(null)
                form.resetFields()
                form.setFieldsValue({ audioCards: [] })
            }
        } catch (error: any) {
            message.error(error.message)
        }
    }
    // fetches all categories for table
    const fetchCategories = async (signal: AbortSignal) => {
        try {
            const feature = 'Article'
            const { data } = await getAllCategories(10, 1, feature, signal)

            if (data) {
                const categoryItems = data.map((cat: ICategory) => ({
                    label: cat.title,
                    value: cat._id
                }))
                setCategories(categoryItems)
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        fetchCategories(signal)
        // form.setFieldsValue({ audioCards: [{}] })
    }, [])

    const filterOption = (input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    const handleFileUpload = (file: File, type: 'shabad' | 'thumbnail'): boolean => {
        const uploadFile = async () => {
            try {
                const formData = new FormData()
                formData.append('image', file)
                formData.append('type', type)

                const response = await uploadFileUrl(formData)

                if (response.success) {
                    if (type === 'thumbnail') {
                        setUploadThumbnail(response.data.url)
                        form.setFieldsValue({ thumbnail: response.data.url })
                    } else {
                        setUploadImage(response.data.url)
                        form.setFieldsValue({ image: response.data.url })
                    }
                }
            } catch (error) {
                //@ts-ignore
                message.error(error.message || 'Upload failed')
            } finally {
                setIsUploading(false)
            }
        }

        setIsUploading(true)
        uploadFile()

        return false
    }

    return (
        <div>
            <div className="flex justify-end my-4 border-0 gap-4">
                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <Button
                        onClick={() => {
                            const existing = form.getFieldValue('audioCards') || []
                            form.setFieldsValue({ audioCards: [...existing, {}] })
                        }}
                        className="font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2">
                        Add Audio Card
                    </Button>
                </ButtonThemeConfig>
                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <Button
                        onClick={() => {
                            const externalLink = form.getFieldValue('linkCards') || []
                            form.setFieldsValue({ linkCards: [...externalLink, {}] })
                        }}
                        className="font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2">
                        Add Link
                    </Button>
                </ButtonThemeConfig>
            </div>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                // initialValues={{ audioCards: [{}] }}
                onFinish={submitBtnHandler}>
                <div className="font-sans">
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans  text-sm font-semibold text-primary">
                            Title<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="title"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter title"
                            required={true}
                            onChange={inputChangeHandler('title')}
                        />
                    </div>

                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans  text-sm font-semibold text-primary">
                            Slug<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="slug"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter slug"
                            required={true}
                            onChange={inputChangeHandler('slug')}
                        />
                    </div>
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans  text-sm font-semibold text-primary">
                            Category<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <ConfigProvider
                            theme={{
                                token: {
                                    controlItemBgActive: 'rgba(5, 5, 5, 0.06)',
                                    colorPrimary: '#083050'
                                },
                                components: {
                                    Select: {
                                        activeOutlineColor: 'transparent'
                                    }
                                }
                            }}>
                            <Form.Item
                                key="category"
                                name="category"
                                className="font-sans w-full"
                                rules={[{ required: true, message: 'Please select category' }]}>
                                <Select
                                    maxCount={3}
                                    allowClear
                                    style={{ width: '100%', height: '48px' }}
                                    className="h-10 2xl:h-12 text-primary font-sans text-lg font-dmSans focus-visible:shadow-none focus:border-[#868E96] transition ease-in duration-500 rounded"
                                    // value={dataValues.tags}
                                    options={categories}
                                    filterOption={filterOption}
                                    placeholder="Select category"
                                    onChange={(value) => form.setFieldsValue({ category: value })}
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </div>
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans  text-sm font-semibold text-primary">
                            Heading Video<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="headingVideo"
                            type="text"
                            regex={videoRegex}
                            placeholder="Enter heading video"
                            required={true}
                            onChange={inputChangeHandler('headingVideo')}
                        />
                    </div>
                    <div className="font-sans mb-4 space-y-2">
                        <div className="font-sans  w-full">
                            <label className="font-sans  text-sm font-semibold text-primary mb-2">
                                Thumbnail
                                <span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    key="thumbnail"
                                    name="thumbnail"
                                    rules={[{ required: true, message: 'Please select thumbnail' }]}>
                                    <UploadImgFile
                                        handleFileUpload={(file) => handleFileUpload(file, 'thumbnail')}
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="font-sans col-span-2 mb-4 h-auto">
                        <label className="font-sans  text-sm font-semibold text-primary mb-2">
                            Article Content
                            <span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <div className="mt-2">
                            <TextEditor
                                name="content"
                                required={true}
                                onChange={(value) => form.setFieldsValue({ content: value })}
                                value={form.getFieldValue('content')}
                            />
                        </div>
                    </div>
                    <div className="font-sans col-span-2 h-auto">
                        <div className="font-sans  w-full">
                            <label className="font-sans  text-sm font-semibold text-primary mb-2">
                                Image
                                <span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    key="image"
                                    name="image"
                                    rules={[{ required: true, message: 'Please select image' }]}>
                                    <UploadImgFile
                                        handleFileUpload={(file) => handleFileUpload(file, 'shabad')}
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    {/* For Audio Link */}
                    <Form.List name="audioCards">
                        {(fields, { remove }) => (
                            <>
                                {fields.map(({ key, name }, index) => (
                                    <div
                                        key={key}
                                        className="my-4 p-4 border border-gray-300 rounded space-y-3">
                                        <h4 className="text-primary font-semibold">Audio Card {index + 1}</h4>

                                        <TextItem
                                            name={[name, 'title']}
                                            type="text"
                                            max={512}
                                            min={2}
                                            placeholder="Enter title"
                                            required={true}
                                            onChange={inputChangeHandler(`audioCards[${index}].title`)}
                                        />

                                        <TextItem
                                            name={[name, 'link']}
                                            type="text"
                                            required={true}
                                            max={512}
                                            placeholder="Enter audio link"
                                            regex={combinedRegex}
                                            onChange={inputChangeHandler(`audioCards[${index}].link`)}
                                        />

                                        <div className="flex justify-end">
                                            <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                                                <Button
                                                    className="custom-danger-button"
                                                    danger
                                                    onClick={() => remove(name)}>
                                                    Remove Audio Card
                                                </Button>
                                            </ButtonThemeConfig>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    {/* For External Link */}
                    <Form.List name="linkCards">
                        {(fields, { remove }) => (
                            <>
                                {fields.map(({ key, name }, index) => (
                                    <div
                                        key={key}
                                        className="my-4 p-4 border border-gray-300 rounded space-y-3">
                                        <h4 className="text-primary font-semibold">Link Card {index + 1}</h4>

                                        <TextItem
                                            name={[name, 'title']}
                                            type="text"
                                            max={512}
                                            min={2}
                                            placeholder="Enter title"
                                            required={true}
                                            onChange={inputChangeHandler(`linkCards[${index}].title`)}
                                        />

                                        <TextItem
                                            name={[name, 'link']}
                                            type="text"
                                            required={true}
                                            max={512}
                                            placeholder="Enter link"
                                            regex={urlRegex}
                                            onChange={inputChangeHandler(`linkCards[${index}].link`)}
                                        />

                                        <div className="flex justify-end">
                                            <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                                                <Button
                                                    className="custom-danger-button"
                                                    danger
                                                    onClick={() => remove(name)}>
                                                    Remove Link Card
                                                </Button>
                                            </ButtonThemeConfig>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>
                </div>
                <div className="font-sans pt-3 w-full justify-end flex gap-2">
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => {
                                navigate('/dashboard/articles')
                            }}
                            type="default"
                            className="font-sans h-auto bg-white text-primary border-primary text-base shadow-none flex justify-center items-center px-4 py-2">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>
                    <div>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <SubmitButton text={`Add`} />
                        </ButtonThemeConfig>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CreateArticle
