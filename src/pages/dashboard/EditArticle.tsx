import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, ConfigProvider, Form, Image, message, Select } from 'antd'
import { EConfigButtonType, ICategory } from '../../types/state.types'
import { getAllCategories } from '../../redux/category/category.thunk'
import LoadingComponent from '../../components/custom/loadingComponent'
import { audioBoxRegex, urlRegex, videoRegex } from '../../quicker/quicker'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { getArticleById, editArticle, uploadFileUrl } from '../../redux/article/article.thunk'
import { SubmitButton, TextEditor, TextItem, UploadImgFile } from '../../components/antdesign/form.components'

const EditArticle = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { articleSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null)
    const [uploadImage, setUploadImage] = useState<string | null>(null)
    const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([])

    const combinedRegex = new RegExp(`${audioBoxRegex.source}|${videoRegex.source}`, 'i')

    const [formValues, setFormValues] = useState({
        title: '',
        slug: '',
        category: null as string | null,
        shabad: '',
        thumbnail: '',
        headingVideo: '',
        content: '',
        audioCards: [] as { title: string; link: string }[],
        externalLink: [] as { title: string; link: string }[]
    })
    // Fetch categories
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
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch categories')
        }
    }

    // Fetch article details
    const fetchArticleDetails = async () => {
        try {
            setLoading(true)
            const data = await getArticleById(articleSlug!)

            if (data) {
                const updatedValues = {
                    title: data.title || '',
                    slug: data.slug || '',
                    category: data.category || null,
                    shabad: data.shabad || '',
                    thumbnail: data.thumbnail || '',
                    headingVideo: data.headingVideo || '',
                    content: data.content || '',
                    audioCards: data.audioCard || [],
                    externalLink: data.externalLink || []
                }
                setLoading(false)
                setUploadImage(data.shabad || '')
                setUploadThumbnail(data.thumbnail || '')
                setFormValues(updatedValues)

                form.setFieldsValue(updatedValues)
            }
        } catch (error: any) {
            setLoading(false)
            message.error(error.message || 'Failed to fetch article details')
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        fetchCategories(signal)
        fetchArticleDetails()

        return () => controller.abort()
    }, [articleSlug])

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        setFormValues((prev) => ({ ...prev, [name]: value }))

        form.setFieldsValue({ [name]: value })
    }

    const onCategoryChange = (value: string | null) => {
        setFormValues((prev) => ({ ...prev, category: value }))
        form.setFieldsValue({ category: value })
    }

    const onContentChange = (value: string) => {
        setFormValues((prev) => ({ ...prev, content: value }))
        form.setFieldsValue({ content: value })
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
                externalLink: (values.externalLink || []).map((link: any) => ({
                    title: link.title,
                    link: link.link
                }))
            }

            const success = await editArticle(articleSlug!, payload)
            if (success) {
                message.success('Article updated successfully')
                navigate('/dashboard/articles')
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to update article')
        }
    }

    const filterOption = (input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    if (loading) {
        return <LoadingComponent />
    }
    const handleFileUpload = (file: File, type: 'shabad' | 'thumbnail'): boolean => {
        const uploadFile = async () => {
            try {
                const formData = new FormData()
                formData.append('image', file)
                formData.append('type', type)

                // Start the upload process
                const response = await uploadFileUrl(formData)
                if (response.success) {
                    const { url, type } = response.data

                    if (type === 'shabad') {
                        setUploadImage(url)
                        form.setFieldsValue({ shabad: url })
                        setFormValues((prev) => ({ ...prev, shabad: url }))
                    } else if (type === 'thumbnail') {
                        setUploadThumbnail(url)
                        form.setFieldsValue({ thumbnail: url })
                        setFormValues((prev) => ({ ...prev, thumbnail: url }))
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
            <div className="flex justify-end my-4 border-0">
                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <Button
                        onClick={() => form.setFieldsValue({ audioCards: [...(form.getFieldValue('audioCards') || []), {}] })}
                        className="font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2">
                        Add Audio Card
                    </Button>
                </ButtonThemeConfig>
            </div>
            <Form
                form={form}
                fields={[
                    { name: 'title', value: formValues.title },
                    { name: 'slug', value: formValues.slug },
                    { name: 'category', value: formValues.category },
                    { name: 'headingVideo', value: formValues.headingVideo },
                    { name: 'content', value: formValues.content },
                    { name: 'shabad', value: formValues.shabad },
                    { name: 'thumbnail', value: formValues.thumbnail },
                    { name: 'audioCards', value: formValues.audioCards },
                    { name: 'externalLink', value: formValues.externalLink }
                ]}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}
                layout="vertical">
                <div className="font-sans">
                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">
                            Title<span className="text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="title"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter Title"
                            required
                            onChange={inputChangeHandler('title')}
                            value={formValues.title}
                        />
                    </div>

                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">Slug</label>
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

                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">
                            Category<span className="text-red-500 pl-1">*</span>
                        </label>
                        <ConfigProvider theme={{ token: { colorPrimary: '#083050' } }}>
                            <Form.Item
                                name="category"
                                rules={[{ required: true, message: 'Please select category' }]}>
                                <Select
                                    allowClear
                                    style={{ width: '100%', height: '48px' }}
                                    options={categories}
                                    filterOption={filterOption}
                                    placeholder="Select Category"
                                    onChange={onCategoryChange}
                                    value={formValues.category}
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
                                    rules={[{ required: false, message: 'Please select thumbnail' }]}>
                                    <UploadImgFile
                                        handleFileUpload={(file) => handleFileUpload(file, 'thumbnail')}
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                    />

                                    {uploadThumbnail && (
                                        <div className="mt-2">
                                            <Image
                                                crossOrigin="anonymous"
                                                width={200}
                                                src={`/${uploadThumbnail}`}
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 h-auto">
                        <label className="text-sm font-semibold text-primary mb-2">
                            Article Content<span className="text-red-500 pl-1">*</span>
                        </label>
                        <div className="mt-2">
                            <TextEditor
                                name="content"
                                required={true}
                                onChange={onContentChange}
                                value={formValues.content || ''}
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
                                    rules={[{ required: false, message: 'Please select image' }]}>
                                    <UploadImgFile
                                        handleFileUpload={(file) => handleFileUpload(file, 'shabad')}
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                    />

                                    {uploadImage && (
                                        <div className="mt-2">
                                            <Image
                                                crossOrigin="anonymous"
                                                width={200}
                                                src={`/${uploadImage}`}
                                            />
                                        </div>
                                    )}
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
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const audioCards = [...(form.getFieldValue('audioCards') || [])]
                                                audioCards[index] = {
                                                    ...audioCards[index],
                                                    title: value
                                                }
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    audioCards
                                                }))
                                                form.setFieldsValue({ audioCards })
                                            }}
                                        />

                                        <TextItem
                                            name={[name, 'link']}
                                            type="text"
                                            required={true}
                                            max={512}
                                            placeholder="Enter audio link"
                                            regex={combinedRegex}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const audioCards = [...(form.getFieldValue('audioCards') || [])]
                                                audioCards[index] = {
                                                    ...audioCards[index],
                                                    link: value
                                                }
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    audioCards
                                                }))
                                                form.setFieldsValue({ audioCards })
                                            }}
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
                    <Form.List name="externalLink">
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
                                            value={formValues.externalLink[index]?.title || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const externalLinks = [...(form.getFieldValue('externalLink') || [])]
                                                externalLinks[index] = {
                                                    ...externalLinks[index],
                                                    title: value
                                                }
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    externalLink: externalLinks
                                                }))
                                                form.setFieldsValue({ externalLink: externalLinks })
                                            }}
                                        />

                                        <TextItem
                                            name={[name, 'link']}
                                            type="text"
                                            required={true}
                                            max={512}
                                            placeholder="Enter link"
                                            regex={urlRegex}
                                            value={formValues.externalLink[index]?.link || ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const externalLinks = [...(form.getFieldValue('externalLink') || [])]
                                                externalLinks[index] = {
                                                    ...externalLinks[index],
                                                    link: value
                                                }
                                                setFormValues((prev) => ({
                                                    ...prev,
                                                    externalLink: externalLinks
                                                }))
                                                form.setFieldsValue({ externalLink: externalLinks })
                                            }}
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

                <div className="pt-3 justify-end flex gap-2">
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => navigate('/dashboard/articles')}
                            type="default"
                            className="h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <SubmitButton
                            text="Update"
                            className="font-sans h-auto bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2"
                        />
                    </ButtonThemeConfig>
                </div>
            </Form>
        </div>
    )
}

export default EditArticle
