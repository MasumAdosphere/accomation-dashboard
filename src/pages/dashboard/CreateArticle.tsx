import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, Form, message, Select } from 'antd'
import { EConfigButtonType, ICategory } from '../../types/state.types'
import { getAllCategories } from '../../redux/category/category.thunk'
import { audioBoxRegex, urlRegex, videoRegex } from '../../quicker/quicker'
import { createArticle } from '../../redux/article/article.thunk'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { TextEditor, TextItem, UploadImgFile } from '../../components/antdesign/form.components'
import { LoadingOutlined } from '@ant-design/icons'

const CreateArticle = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState<Array<ICategory>>([])

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Store the actual File objects
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const combinedRegex = new RegExp(`${audioBoxRegex.source}|${videoRegex.source}`, 'i')

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            // Create FormData with File objects (not URLs)
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('category', values.category)
            formData.append('author', values.author)
            formData.append('content', values.content || '')

            // Append actual File objects
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile)
            }
            if (imageFile) {
                formData.append('image', imageFile)
            }

            console.log('FormData:', Object.fromEntries(formData.entries()))

            const success = await createArticle(formData)
            if (success) {
                setThumbnailFile(null)
                setImageFile(null)
                form.resetFields()
                form.setFieldsValue({ audioCards: [] })
            }
        } catch (error: any) {
            message.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const fetchCategories = async (signal: AbortSignal) => {
        try {
            const feature = 'Blog'
            const { data } = await getAllCategories(10, 1, feature, signal)

            if (data) {
                const categoryItems = data.map((cat: ICategory) => ({
                    label: cat.title,
                    value: cat.id
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
    }, [])

    const filterOption = (input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    return (
        <div>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
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
                                    options={categories}
                                    filterOption={filterOption}
                                    placeholder="Select category"
                                    onChange={(value) => form.setFieldsValue({ category: value })}
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </div>

                    {/* <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans  text-sm font-semibold text-primary">
                            Author<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="author"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter author"
                            required={true}
                            onChange={inputChangeHandler('author')}
                        />
                    </div> */}

                    {/* <div className="font-sans mb-4 space-y-2">
                        <div className="font-sans  w-full">
                            <label className="font-sans  text-sm font-semibold text-primary mb-2">
                                Thumbnail
                                <span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    name="thumbnail"
                                    rules={[{ required: true, message: 'Please select thumbnail' }]}>
                                    <UploadImgFile
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                        onFileSelect={(file) => {
                                            setImageFile(file)
                                            const previewUrl = URL.createObjectURL(file)
                                            setUploadImage(previewUrl)
                                            form.setFieldsValue({ image: 'uploaded' })
                                        }}
                                        handleFileUpload={function (): boolean | Promise<boolean> {
                                            throw new Error('Function not implemented.')
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div> */}

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
                                    name="image"
                                    rules={[{ required: true, message: 'Please select image' }]}>
                                    <UploadImgFile
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                        onFileSelect={(file) => {
                                            setThumbnailFile(file)

                                            form.setFieldsValue({ thumbnail: 'uploaded' })
                                        }}
                                        handleFileUpload={function (): boolean | Promise<boolean> {
                                            throw new Error('Function not implemented.')
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/* Audio Cards and Link Cards remain the same */}
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
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto rounded-lg bg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flex justify-center items-center px-6 py-2"
                                style={{ width: 'auto' }}>
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CreateArticle
