import { Button, ConfigProvider, Drawer, Form, Image, Input, message, Select } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EConfigButtonType, ICareer, ICareerCreate, ICategory } from '../../types/state.types'
import { createTestimonials, editTestimonials, getTestimonialById } from '../../redux/testimonials/testimonial.thunk'
import { getAllCategories } from '../../redux/category/category.thunk'
import { TextEditor, TextItem, UploadImgFile } from './form.components'
import { ButtonThemeConfig } from './configs.components'
import { LoadingOutlined } from '@ant-design/icons'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { createFaq, editFaq, getFaqById, uploadFileUrl } from '../../redux/faq/faq.thunk'
import { createLogo } from '../../redux/logo/logo.thunk'
import { audioBoxRegex, urlRegex, videoRegex } from '../../quicker/quicker'
import { createArticle, editArticle, getArticleById } from '../../redux/article/article.thunk'
import LoadingComponent from '../custom/loadingComponent'
import { createCareer, editCareer, getCareerById } from '../../redux/career/career.thunk'

export const CreateTestimonialDrawer = ({
    isCreateTestimonialDrawerOpen,
    SetIsCreateTestimonialDrawerOpen
}: {
    isCreateTestimonialDrawerOpen: boolean
    SetIsCreateTestimonialDrawerOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState<Array<ICategory>>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('designation', values.designation)
            formData.append('description', values.description || '')

            if (imageFile) {
                formData.append('image', imageFile)
            }

            const success = await createTestimonials(formData)
            if (success) {
                setImageFile(null)
                form.resetFields()
                dispatch(setIsDataRefreshed(!isDataRefreshed))

                SetIsCreateTestimonialDrawerOpen(false)
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
    return (
        <Drawer
            open={isCreateTestimonialDrawerOpen}
            onClose={() => SetIsCreateTestimonialDrawerOpen(false)}
            footer={null}
            width={500}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}>
                <div className="font-sans">
                    {/* Name */}
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Name<span className="font-sans text-red-500pl-1">*</span>
                        </label>
                        <TextItem
                            name="name"
                            type="text"
                            max={512}
                            min={2}
                            placeholder="Enter name"
                            required={true}
                            onChange={inputChangeHandler('name')}
                        />
                    </div>

                    {/*Designation*/}
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Designation<span className="font-sans text-red-500pl-1">*</span>
                        </label>
                        <TextItem
                            name="designation"
                            type="text"
                            max={512}
                            min={2}
                            placeholder="Enter designation"
                            required={true}
                            onChange={inputChangeHandler('designation')}
                        />
                    </div>

                    {/*Description*/}
                    <div className="font-sans mb-4 space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Description<span className="font-sans text-red-500pl-1">*</span>
                        </label>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: 'Please enter description' }]}>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Enter description"
                                className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:border-primary focus:shadow-none transition"
                                onChange={(e) => {
                                    const value = e.target.value
                                    form.setFieldsValue({ description: value })
                                }}
                            />
                        </Form.Item>
                    </div>

                    {/*Image*/}
                    <div className="font-sanscol-span-2 h-auto">
                        <div className="font-sans w-full">
                            <label className="font-sans text-sm font-semibold text-primary mb-2">
                                Image<span className="font-sans text-red-500pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    name="image"
                                    rules={[{ required: true, message: 'Please select image' }]}>
                                    <UploadImgFile
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                        onFileSelect={(file) => {
                                            setImageFile(file)
                                            form.setFieldsValue({ image: 'uploaded' })
                                        }}
                                        handleFileUpload={function (): boolean | Promise<boolean> {
                                            throw new Error('Function not implemented.')
                                        }}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    {/*Buttons*/}
                    <div className="font-sanspt-3 w-full justify-end flex gap-2">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => {
                                    navigate('/dashboard/testimonials')
                                }}
                                type="default"
                                className="font-sans h-autobg-white text-primary border-primary text-base shadow-none flexjustify-center item-center px-4 py-2">
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
                                    className="font-sans h-autorounded-lgbg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flexjustify-center item-center px-6 py-2"
                                    style={{ width: 'auto' }}>
                                    {isSubmitting ? 'Adding...' : 'Add'}
                                </Button>
                            </ButtonThemeConfig>
                        </div>
                    </div>
                </div>
            </Form>
        </Drawer>
    )
}

export const CreateFaqDrawer = ({
    isCreateFaqDrawerOpen,
    SetIsCreateFaqDrawerOpen
}: {
    isCreateFaqDrawerOpen: boolean
    SetIsCreateFaqDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const dispatch = useDispatch()

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            // Prepare payload matching API structure
            const payload = {
                question: values.question.trim(),
                answer: values.answer.trim(),
                pageName: values.page || ''
            }

            const success = await createFaq(payload)

            if (success) {
                form.resetFields()
                navigate('/dashboard/faq')
                SetIsCreateFaqDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to create FAQ. Please try again.',
                duration: 8
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    return (
        <Drawer
            open={isCreateFaqDrawerOpen}
            onClose={() => SetIsCreateFaqDrawerOpen(false)}
            footer={null}
            width={500}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}>
                <div className="font-sans space-y-6">
                    {/* Question Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Question<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="question"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter the question..."
                            required={true}
                            className="h-10 2xl:h-12"
                            onChange={inputChangeHandler('question')}
                        />
                    </div>

                    {/* Answer Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Answer<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <Form.Item
                            name="answer"
                            rules={[{ required: true, message: 'Please enter the answer' }]}>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base leading-relaxed resize-y"
                                rows={8}
                                placeholder="Write the detailed answer here..."
                                maxLength={2000}
                            />
                        </Form.Item>
                    </div>

                    {/* Page Dropdown */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Page<span className="font-sans text-red-500 pl-1">*</span>
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
                                name="page"
                                rules={[{ required: true, message: 'Please select a page' }]}>
                                <Select
                                    allowClear
                                    style={{ width: '100%', height: '48px' }}
                                    className="h-10 2xl:h-12 text-primary font-sans text-lg font-dmSans focus-visible:shadow-none focus:border-[#868E96] transition ease-in duration-500 rounded"
                                    placeholder="Select page (e.g., Overview, Blog, Testimonial)"
                                    options={[
                                        { value: 'Overview', label: 'Overview' },
                                        { value: 'Blog', label: 'Blog' },
                                        { value: 'Testimonial', label: 'Testimonial' }
                                    ]}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    onChange={(value) => form.setFieldsValue({ pageName: value })}
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="font-sans pt-6 w-full justify-end flex gap-4">
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => navigate('/dashboard/faqs')}
                            type="default"
                            className="font-sans bg-white text-primary border-primary text-base shadow-none flex justify-center items-center px-6 py-2 h-auto">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto rounded-lg bg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flex justify-center items-center px-6 py-2"
                            style={{ width: 'auto' }}>
                            {isSubmitting ? 'Creating...' : 'Create FAQ'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

export const CreateLogoDrawer = ({
    isCreateLogoDrawerOpen,
    SetIsCreateLogoDrawerOpen
}: {
    isCreateLogoDrawerOpen: boolean
    SetIsCreateLogoDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isUploading, setIsUploading] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const inputChangeHandler = (companyName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        form.setFieldsValue({ [companyName]: value })
    }

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            // ✅ Create FormData with only name and logo file
            const formData = new FormData()
            formData.append('companyName', values.companyName.trim())
            if (logoFile) {
                formData.append('logo', logoFile) // 👈 Send the actual file
            }

            const success = await createLogo(formData) // 👈 Sends FormData, not JSON

            if (success) {
                setLogoFile(null)
                form.resetFields()
                SetIsCreateLogoDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to upload logo. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLogoUpload = (file: File) => {
        setLogoFile(file)
        form.setFieldsValue({ logo: 'uploaded' }) // Optional: visual feedback
    }

    return (
        <Drawer
            open={isCreateLogoDrawerOpen}
            onClose={() => SetIsCreateLogoDrawerOpen(false)}
            footer={null}
            width={500}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}>
                <div className="font-sans space-y-6">
                    {/* Logo Name Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Name<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="companyName"
                            type="text"
                            max={100}
                            min={2}
                            placeholder="Enter logo name (e.g., Navshakti)"
                            required={true}
                            className="h-10 2xl:h-12"
                            onChange={inputChangeHandler('companyName')}
                        />
                    </div>

                    {/* Logo Upload Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Logo Image<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <div className="mt-2">
                            <Form.Item
                                name="logo"
                                rules={[{ required: true, message: 'Please upload a logo image' }]}>
                                <UploadImgFile
                                    accept="image/png,image/jpeg"
                                    isUploading={isUploading}
                                    onFileSelect={handleLogoUpload}
                                    // 👇 We're not using handleFileUpload — it's not needed
                                    handleFileUpload={() => false}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Preview (Optional) */}
                    {logoFile && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-sm font-medium text-gray-700">Preview:</p>
                            <img
                                src={URL.createObjectURL(logoFile)}
                                alt="Logo preview"
                                className="h-20 w-auto object-contain mt-2 rounded"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = 'https://via.placeholder.com/200x80?text=Preview+Unavailable'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="font-sans pt-6 w-full justify-end flex gap-4">
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => navigate('/dashboard/logos')}
                            type="default"
                            className="font-sans bg-white text-primary border-primary text-base shadow-none flex justify-center items-center px-6 py-2 h-auto">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto rounded-lg bg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flex justify-center items-center px-6 py-2"
                            style={{ width: 'auto' }}>
                            {isSubmitting ? 'Uploading...' : 'Upload Logo'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

export const CreateArticleDrawer = ({
    isCreateArticleDrawerOpen,
    SetIsCreateArticleDrawerOpen
}: {
    isCreateArticleDrawerOpen: boolean
    SetIsCreateArticleDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

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
                SetIsCreateArticleDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
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
        <Drawer
            open={isCreateArticleDrawerOpen}
            onClose={() => SetIsCreateArticleDrawerOpen(false)}
            footer={null}
            width={1000}>
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
        </Drawer>
    )
}

export const EditArticleDrawer = ({
    isEditArticleDrawerOpen,
    SetIsEditArticleDrawerOpen,
    selectedArticleId
}: {
    selectedArticleId: string
    isEditArticleDrawerOpen: boolean
    SetIsEditArticleDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const articleSlug = selectedArticleId
    const [loading, setLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadThumbnail, setUploadThumbnail] = useState<string | null>(null)
    const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([])

    const [isSubmitting, setIsSubmitting] = useState(false)

    interface IArticleFormValues {
        title: string
        category: string | null
        thumbnail: string
        content: string
    }

    const [formValues, setFormValues] = useState<IArticleFormValues>({
        title: '',
        category: null,
        thumbnail: '',
        content: ''
    })
    // Fetch categories
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
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch categories')
        }
    }

    const fetchArticleDetails = async () => {
        try {
            setLoading(true)
            const data = await getArticleById(articleSlug!)

            if (data) {
                const updatedValues = {
                    title: data.title || '',

                    category: data.category?.id || null,

                    thumbnail: data.thumbnail || '',
                    content: data.content || ''
                }
                setLoading(false)
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
            setIsSubmitting(true)
            const payload = {
                title: values.title,

                category: values.category,

                content: values.content || '',

                thumbnail: uploadThumbnail
            }

            const success = await editArticle(articleSlug!, payload)

            SetIsEditArticleDrawerOpen(false)
            dispatch(setIsDataRefreshed(!isDataRefreshed))
            // SetIsEditArticleDrawerOpen(false)
            if (success) {
                message.success('Article updated successfully')
                // SetIsEditArticleDrawerOpen(false)
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to update article')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filterOption = (input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    if (loading) {
        return <LoadingComponent />
    }
    const handleFileUpload = (file: File, type: 'thumbnail'): boolean => {
        const uploadFile = async () => {
            try {
                const formData = new FormData()
                formData.append('image', file)
                formData.append('type', type)

                // Start the upload process
                const response = await uploadFileUrl(formData)
                if (response.success) {
                    const { url } = response.data

                    setUploadThumbnail(url)
                    form.setFieldsValue({ thumbnail: url })
                    setFormValues((prev) => ({ ...prev, thumbnail: url }))
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
        <Drawer
            open={isEditArticleDrawerOpen}
            onClose={() => SetIsEditArticleDrawerOpen(false)}
            footer={null}
            width={1000}>
            <Form
                form={form}
                fields={[
                    { name: 'title', value: formValues.title },
                    { name: 'category', value: formValues.category },
                    { name: 'content', value: formValues.content },
                    { name: 'thumbnail', value: formValues.thumbnail }
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

                    {/* <div className="mb-4 space-y-2">
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
                    </div> */}

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
                                        onFileSelect={function (): void {
                                            throw new Error('Function not implemented.')
                                        }}
                                    />

                                    {uploadThumbnail && (
                                        <div className="mt-2">
                                            <Image
                                                width={200}
                                                src={uploadThumbnail.startsWith('http') ? uploadThumbnail : `/${uploadThumbnail}`}
                                                preview={false}
                                                // fallback="https://via.placeholder.com/200x150?text=No+Image"
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

                    {/* For Audio Link */}
                    {/* <Form.List name="audioCards">
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
                    </Form.List> */}
                    {/* For External Link */}
                    {/* <Form.List name="externalLink">
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
                    </Form.List> */}
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
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2">
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

export const EditTestimonialDrawer = ({
    isEditTestimonialDrawerOpen,
    SetIsEditTestimonialDrawerOpen,
    selectedTestimonialId
}: {
    selectedTestimonialId: string
    isEditTestimonialDrawerOpen: boolean
    SetIsEditTestimonialDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const [form] = Form.useForm()
    const navigate = useNavigate()
    const testimonialId = selectedTestimonialId

    const [loading, setLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadImage, setUploadImage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [formValues, setFormValues] = useState({
        name: '',
        designation: '',
        description: '',
        image: ''
    })

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setFormValues((prev) => ({ ...prev, [name]: value }))
        form.setFieldsValue({ [name]: value })
    }

    const fetchTestimonialDetails = async () => {
        try {
            setLoading(true)
            const data = await getTestimonialById(testimonialId!)

            if (data) {
                const updatedValues = {
                    name: data.name || '',
                    designation: data.designation || '',
                    description: data.description || '',
                    image: data.image || ''
                }

                setFormValues(updatedValues)
                setImageFile(null)
                setUploadImage(data.image || '')
                form.setFieldsValue(updatedValues)

                setLoading(false)
            }
        } catch (error: any) {
            setLoading(false)
            message.error(error.message || 'Failed to fetch testimonial details')
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        fetchTestimonialDetails()

        return () => controller.abort()
    }, [testimonialId])

    const submitBtnHandler = async () => {
        try {
            const values = await form.validateFields()
            setIsSubmitting(true)

            const formData = new FormData()
            formData.append('name', values.name)
            formData.append('designation', values.designation)
            formData.append('description', values.description || '')

            // Always send image field
            if (imageFile) {
                //New file uploadeded
                formData.append('image', imageFile)
            } else {
                //No new file → send existing URL
                if (formValues.image) {
                    formData.append('image', formValues.image)
                }
            }

            const success = editTestimonials(testimonialId!, formData)
            if (await success) {
                message.success('Testimonial updated successfully')

                SetIsEditTestimonialDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to update testimonial')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <Drawer
            open={isEditTestimonialDrawerOpen}
            onClose={() => SetIsEditTestimonialDrawerOpen(false)}
            footer={null}
            width={1000}>
            <Form
                form={form}
                fields={[
                    { name: 'name', value: formValues.name },
                    { name: 'designation', value: formValues.designation },
                    { name: 'description', value: formValues.description },
                    { name: 'image', value: formValues.image }
                ]}
                className="font-sans w-full flexjustify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}
                layout="vertical">
                <div className="font-sans">
                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">
                            Name<span className="text-red-500pl-1">*</span>
                        </label>
                        <TextItem
                            name="name"
                            type="text"
                            max={512}
                            min={2}
                            placeholder="Enter name"
                            required
                            onChange={inputChangeHandler('name')}
                            value={formValues.name}
                        />
                    </div>

                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">
                            Designation<span className="text-red-500pl-1">*</span>
                        </label>
                        <TextItem
                            name="designation"
                            type="text"
                            max={512}
                            min={2}
                            placeholder="Enter designation"
                            required
                            onChange={inputChangeHandler('designation')}
                            value={formValues.designation}
                        />
                    </div>

                    <div className="mb-4 space-y-2">
                        <label className="text-sm font-semibold text-primary">
                            Description<span className="text-red-500pl-1">*</span>
                        </label>
                        <Form.Item
                            name="description"
                            rules={[{ required: true, message: 'Please enter description' }]}>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="Enter description"
                                className="w-full h-32 border border-gray-300rounded-lg p-3 focus:border-primary focus:shadow-none transition"
                                onChange={(e) => {
                                    const value = e.target.value
                                    form.setFieldsValue({ description: value })
                                }}
                            />
                        </Form.Item>
                    </div>

                    <div className="font-sans col-span-2 h-auto">
                        <div className="font-sans w-full">
                            <label className="font-sans text-sm font-semibold text-primary mb-2">
                                Image<span className="font-sans text-red-500pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    name="image"
                                    rules={[{ required: true, message: 'Please select image' }]}>
                                    <UploadImgFile
                                        accept="image/png,image/jpeg"
                                        isUploading={isUploading}
                                        onFileSelect={(file) => {
                                            // 1. Start upload → show loading
                                            setIsUploading(true)

                                            // 2. Simulate upload (or call API)
                                            const uploadFile = async () => {
                                                try {
                                                    await new Promise((resolve) => setTimeout(resolve, 1000))
                                                    const previewUrl = URL.createObjectURL(file)
                                                    setUploadImage(previewUrl)
                                                    setImageFile(file)
                                                    form.setFieldsValue({ image: 'uploaded' })
                                                } catch (error) {
                                                    message.error('Upload failed')
                                                } finally {
                                                    setIsUploading(false)
                                                }
                                            }

                                            uploadFile()
                                        }}
                                        handleFileUpload={function (): boolean | Promise<boolean> {
                                            throw new Error('Function not implemented.')
                                        }}
                                    />

                                    {uploadImage && (
                                        <div className="mt-2">
                                            <Image
                                                width={200}
                                                src={uploadImage.startsWith('http') ? uploadImage : `/${uploadImage}`}
                                                preview={false}
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 justify-end flex gap-2">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                onClick={() => navigate('/dashboard/testimonials')}
                                type="default"
                                className="h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto bg-primary text-white border-primary text-lg shadow-none flexjustify-centeritem-center px-4 py-2">
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </div>
            </Form>
        </Drawer>
    )
}

export const EditFaqDrawer = ({
    isEditFaqDrawerOpen,
    SetIsEditFaqDrawerOpen,
    selectedFaqId
}: {
    selectedFaqId: string
    isEditFaqDrawerOpen: boolean
    SetIsEditFaqDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const faqId = selectedFaqId
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchFaqDetails = async () => {
        try {
            setLoading(true)
            const data = await getFaqById(faqId as string)

            console.log('id', faqId)

            console.log('api response', data)

            if (data) {
                const initialValues = {
                    question: data.question || '',
                    answer: data.answer || '',
                    pageName: data.pageName || ''
                }

                form.setFieldsValue(initialValues)
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch FAQ details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaqDetails()
    }, [faqId])

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            // Prepare payload matching API structure
            const payload = {
                question: values.question.trim(),
                answer: values.answer.trim(),
                pageName: values.pageName || ''
            }

            const success = await editFaq(faqId!, payload)

            if (success) {
                message.success('FAQ updated successfully')
                dispatch(setIsDataRefreshed(!isDataRefreshed))

                SetIsEditFaqDrawerOpen(false)
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to update FAQ. Please try again.',
                duration: 8
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    return (
        <Drawer
            open={isEditFaqDrawerOpen}
            onClose={() => SetIsEditFaqDrawerOpen(false)}
            footer={null}
            width={1000}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full mt-4"
                onFinish={submitBtnHandler}>
                <div className="font-sans space-y-6">
                    {/* Question Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Question<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="question"
                            type="text"
                            max={512}
                            min={4}
                            placeholder="Enter the question..."
                            required={true}
                            className="h-10 2xl:h-12"
                            onChange={inputChangeHandler('question')}
                        />
                    </div>

                    {/* Answer Field */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Answer<span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <Form.Item
                            name="answer"
                            rules={[{ required: true, message: 'Please enter the answer' }]}>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base leading-relaxed resize-y"
                                rows={8}
                                placeholder="Write the detailed answer here..."
                                maxLength={2000}
                            />
                        </Form.Item>
                    </div>

                    {/* Page Dropdown */}
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-semibold text-primary">
                            Page<span className="font-sans text-red-500 pl-1">*</span>
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
                                name="pageName"
                                rules={[{ required: true, message: 'Please select a page' }]}>
                                <Select
                                    allowClear
                                    style={{ width: '100%', height: '48px' }}
                                    className="h-10 2xl:h-12 text-primary font-sans text-lg font-dmSans focus-visible:shadow-none focus:border-[#868E96] transition ease-in duration-500 rounded"
                                    placeholder="Select page (e.g., Overview, Blog, Testimonial)"
                                    options={[
                                        { value: 'Overview', label: 'Overview' },
                                        { value: 'Blog', label: 'Blog' },
                                        { value: 'Testimonial', label: 'Testimonial' }
                                    ]}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    onChange={(value) => form.setFieldsValue({ pageName: value })}
                                />
                            </Form.Item>
                        </ConfigProvider>
                    </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="font-sans pt-6 w-full justify-end flex gap-4">
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => navigate('/dashboard/faqs')}
                            type="default"
                            className="font-sans bg-white text-primary border-primary text-base shadow-none flex justify-center items-center px-6 py-2 h-auto">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto rounded-lg bg-primary text-white border-primary text-base 2xl:text-[20px] shadow-none flex justify-center items-center px-6 py-2"
                            style={{ width: 'auto' }}>
                            {isSubmitting ? 'Updating...' : 'Update FAQ'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

export const CreateCareerDrawer = ({
    isCreateCareerDrawerOpen,
    SetIsCreateCareerDrawerOpen
}: {
    isCreateCareerDrawerOpen: boolean
    SetIsCreateCareerDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            const payload: ICareerCreate = {
                jobrole: values.jobrole.trim(),
                employmentType: values.employmentType,
                location: values.location.trim(),
                experience: values.experience.trim(),
                jobDescription: values.jobDescription.trim()
            }

            const success = await createCareer(payload)

            if (success) {
                message.success('Career created successfully')
                form.resetFields()
                SetIsCreateCareerDrawerOpen(false)

                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to create career. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer
            title="Create New Career"
            open={isCreateCareerDrawerOpen}
            onClose={() => SetIsCreateCareerDrawerOpen(false)}
            width={600}
            footer={
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={() => SetIsCreateCareerDrawerOpen(false)}
                        className="text-primary border-primary">
                        Cancel
                    </Button>
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-primary text-white">
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            }>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}>
                <Form.Item
                    name="jobrole"
                    label="Job Role"
                    rules={[{ required: true, message: 'Please enter job role' }]}>
                    <Input placeholder="e.g., Frontend Developer" />
                </Form.Item>

                <Form.Item
                    name="employmentType"
                    label="Employment Type"
                    rules={[{ required: true, message: 'Please select employment type' }]}>
                    <Select
                        placeholder="Select employment type"
                        options={[
                            { value: 'fullTime', label: 'Full Time' },
                            { value: 'partTime', label: 'Part Time' },
                            { value: 'internship', label: 'Internship' }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Please enter location' }]}>
                    <Input placeholder="e.g., Bengaluru, India" />
                </Form.Item>

                <Form.Item
                    name="experience"
                    label="Experience"
                    rules={[{ required: true, message: 'Please enter experience' }]}>
                    <Input placeholder="e.g., 2–5 years" />
                </Form.Item>

                <Form.Item
                    name="jobDescription"
                    label="Job Description"
                    rules={[{ required: true, message: 'Please enter job description' }]}>
                    <Input.TextArea
                        rows={6}
                        placeholder="Describe responsibilities, skills, qualifications..."
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export const EditCareerDrawer = ({
    isEditCareerDrawerOpen,
    SetIsEditCareerDrawerOpen,
    selectedCareerId
}: {
    selectedCareerId: string
    isEditCareerDrawerOpen: boolean
    SetIsEditCareerDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const dispatch = useDispatch()
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchCareerDetails = async () => {
        try {
            setLoading(true)
            if (!selectedCareerId) return

            const data = await getCareerById(selectedCareerId)

            console.log('✅ Career data fetched:', data)

            if (data && typeof data === 'object') {
                const initialValues: ICareerCreate = {
                    jobrole: data.jobrole || '',
                    employmentType: data.employmentType || 'Full-time',
                    location: data.location || '',
                    experience: data.experience || '',
                    jobDescription: data.jobDescription || ''
                }

                form.setFieldsValue(initialValues)
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to fetch career details')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedCareerId && isEditCareerDrawerOpen) {
            fetchCareerDetails()
        }
    }, [selectedCareerId, isEditCareerDrawerOpen])

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            const payload: Partial<ICareer> = {
                jobrole: values.jobrole.trim(),
                employmentType: values.employmentType,
                location: values.location.trim(),
                experience: values.experience.trim(),
                jobDescription: values.jobDescription.trim()
            }

            const success = await editCareer(selectedCareerId, payload)

            if (success) {
                message.success('Career updated successfully')
                SetIsEditCareerDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to update career. Please try again.',
                duration: 8
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer
            title="Edit Career"
            open={isEditCareerDrawerOpen}
            onClose={() => SetIsEditCareerDrawerOpen(false)}
            width={600}
            footer={
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={() => SetIsEditCareerDrawerOpen(false)}
                        className="text-primary border-primary">
                        Cancel
                    </Button>
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting || loading}
                            className="bg-primary text-white">
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            }>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{}}>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <p className="text-color51">Loading career details...</p>
                    </div>
                ) : (
                    <>
                        <Form.Item
                            name="jobrole"
                            label="Job Role"
                            rules={[{ required: true, message: 'Please enter job role' }]}>
                            <Input placeholder="e.g., Frontend Developer" />
                        </Form.Item>

                        <Form.Item
                            name="employmentType"
                            label="Employment Type"
                            rules={[{ required: true, message: 'Please select employment type' }]}>
                            <Select
                                placeholder="Select employment type"
                                options={[
                                    { value: 'Full-time', label: 'Full Time' },
                                    { value: 'Part-time', label: 'Part Time' },
                                    { value: 'Contract', label: 'Contract' }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            label="Location"
                            rules={[{ required: true, message: 'Please enter location' }]}>
                            <Input placeholder="e.g., Bengaluru, India" />
                        </Form.Item>

                        <Form.Item
                            name="experience"
                            label="Experience"
                            rules={[{ required: true, message: 'Please enter experience' }]}>
                            <Input placeholder="e.g., 2–5 years" />
                        </Form.Item>

                        <Form.Item
                            name="jobDescription"
                            label="Job Description"
                            rules={[{ required: true, message: 'Please enter job description' }]}>
                            <Input.TextArea
                                rows={6}
                                placeholder="Describe responsibilities, skills, qualifications..."
                            />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Drawer>
    )
}
