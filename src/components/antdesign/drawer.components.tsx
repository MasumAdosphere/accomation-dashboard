import { Button, ConfigProvider, Drawer, Form, Image, message, Select } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleData, EConfigButtonType, ICareer, ICareerCreate, ICategory } from '../../types/state.types'
import { createTestimonials, editTestimonials, getTestimonialById } from '../../redux/testimonials/testimonial.thunk'
import { createCategory, editCategory, getAllCategories } from '../../redux/category/category.thunk'
import { PasswordInput, TextAreaItem, TextItem, UploadImgFile } from './form.components'
import { ButtonThemeConfig } from './configs.components'
import { LoadingOutlined } from '@ant-design/icons'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { createFaq, editFaq, getFaqById } from '../../redux/faq/faq.thunk'
import { createLogo } from '../../redux/logo/logo.thunk'
import { createArticle, editArticle } from '../../redux/article/article.thunk'
import { createCareer, editCareer, getCareerById } from '../../redux/career/career.thunk'
import Editor from '../custom/Editor'
import { createUsers } from '../../redux/user/user.thunk'

export const CreateTestimonialDrawer = ({
    isCreateTestimonialDrawerOpen,
    SetIsCreateTestimonialDrawerOpen
}: {
    isCreateTestimonialDrawerOpen: boolean
    SetIsCreateTestimonialDrawerOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    return (
        <Drawer
            open={isCreateTestimonialDrawerOpen}
            onClose={() => SetIsCreateTestimonialDrawerOpen(false)}
            footer={null}
            title="Add Testimonial"
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}>
                <div className="font-sans flex flex-col justify-between h-full">
                    {/* Name */}
                    <div className="">
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
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
                                className=""
                            />
                        </div>

                        {/*Designation*/}
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
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
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Description<span className="font-sans text-red-500pl-1">*</span>
                            </label>
                            <Form.Item name="description">
                                <TextAreaItem
                                    name="description"
                                    placeholder="Enter description"
                                    className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        form.setFieldsValue({ description: value })
                                    }}
                                    required={true}
                                />
                            </Form.Item>
                        </div>

                        {/*Image*/}
                        <div className="font-sans col-span-2 h-auto">
                            <div className="font-sans w-full">
                                <label className="font-sans text-font16 font-semibold text-gray44 mb-1">
                                    Upload Image<span className="font-sans text-red-500pl-1">*</span>
                                </label>
                                <div className="grid grid-cols-1 !border-[#000] p-1 !w-full !rounded-[100px] ">
                                    <Form.Item
                                        name="image"
                                        rules={[{ required: true, message: 'Please select image' }]}>
                                        <UploadImgFile
                                            onFileSelect={(file) => {
                                                setImageFile(file)
                                            }}
                                            onChange={(fileName) => {
                                                form.setFieldsValue({ image: fileName || '' })
                                            }}
                                            handleFileUpload={async (file) => {
                                                setImageFile(file)
                                                // Your upload logic here if needed
                                                return true
                                            }}
                                            className="w-full"
                                            accept="image/png,image/jpeg"
                                            isUploading={false}
                                        />
                                    </Form.Item>
                                    <span className="text-gray44 mt-2 font-medium font-Metropolis">
                                        Note: Please ensure to upload square image for better visualization
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Buttons*/}
                    <div className="font-sans grid grid-cols-2 w-full pt-3 justify-end  gap-2">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => {
                                    SetIsCreateTestimonialDrawerOpen(false)
                                }}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>

                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white  border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
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
            title="Add FAQ"
            open={isCreateFaqDrawerOpen}
            onClose={() => SetIsCreateFaqDrawerOpen(false)}
            footer={null}
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}>
                <div className="font-sans space-y-6">
                    {/* Question Field */}
                    <div className="flex flex-col gap-4 h-full justify-between">
                        <div className="space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Question<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <TextItem
                                name="question"
                                type="text"
                                max={512}
                                min={4}
                                placeholder="Enter the question..."
                                required={true}
                                onChange={inputChangeHandler('question')}
                            />
                        </div>

                        {/* Answer Field */}
                        <div className="space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Answer<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <Form.Item
                                name="answer"
                                rules={[{ required: true, message: 'Please enter the answer' }]}>
                                <TextAreaItem
                                    className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                    placeholder="Write the detailed answer here..."
                                    onChange={() => {}}
                                    name={''}
                                    required={false}
                                />
                            </Form.Item>
                        </div>

                        {/* Page Dropdown */}
                        <div className="space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Page<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#7f69e2'
                                    },
                                    components: {
                                        Select: {
                                            activeOutlineColor: '#7f69e2',
                                            hoverBorderColor: '#7f69e2'
                                        }
                                    }
                                }}>
                                <Form.Item
                                    name="page"
                                    rules={[{ required: true, message: 'Please select a page' }]}>
                                    <Select
                                        allowClear
                                        className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#dddddd]"
                                        placeholder="Select page (e.g., Overview, Blog, Testimonial)"
                                        options={[
                                            { value: 'overview', label: 'Overview' },
                                            { value: 'blog', label: 'Blog' },
                                            { value: 'testimonial', label: 'Testimonial' }
                                        ]}
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                        onChange={(value) => form.setFieldsValue({ pageName: value })}
                                    />
                                </Form.Item>
                            </ConfigProvider>
                        </div>
                    </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="font-sans grid grid-cols-2  pt-6 w-full justify-end  gap-4">
                    <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                        <Button
                            onClick={() => SetIsCreateFaqDrawerOpen(false)}
                            type="default"
                            className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
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

    return (
        <Drawer
            title="Add Logo"
            open={isCreateLogoDrawerOpen}
            onClose={() => SetIsCreateLogoDrawerOpen(false)}
            footer={null}
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}>
                <div className="h-full flex flex-col justify-between">
                    <div className="font-sans space-y-4">
                        {/* Logo Name Field */}
                        <div className="space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Name<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <TextItem
                                name="companyName"
                                type="text"
                                max={100}
                                min={2}
                                placeholder="Enter logo name (e.g., Navshakti)"
                                required={true}
                                className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                onChange={inputChangeHandler('companyName')}
                            />
                        </div>

                        {/* Logo Upload Field */}
                        <div className="space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Logo Image<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Form.Item
                                    name="logo"
                                    rules={[{ required: true, message: 'Please upload a logo image' }]}>
                                    <UploadImgFile
                                        accept="image/png,image/jpeg"
                                        isUploading={false}
                                        onFileSelect={(file) => {
                                            setLogoFile(file)
                                        }}
                                        // 👇 We're not using handleFileUpload — it's not needed
                                        handleFileUpload={() => false}
                                    />
                                </Form.Item>
                            </div>
                            <p className="text-gray44 mt-2 font-medium font-Metropolis">
                                Note: Please upload the logo in 240px (width) x 92px (height) to ensure proper alignment with other logos.
                            </p>
                        </div>

                        {/* Preview (Optional) */}
                        {logoFile && (
                            <div className="mt-4 p-4 bg-gray-50 !rounded-[6px] border border-dashed border-gray-300">
                                <p className="text-sm font-medium text-gray-700">Preview:</p>
                                <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="Logo preview"
                                    className="h-20 w-auto object-contain mt-2 rounded"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit & Cancel Buttons */}
                    <div className="font-sans pt-6 grid grid-cols-2 gap-3">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => navigate('/dashboard/logos')}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>

                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
                                style={{ width: 'auto' }}>
                                {isSubmitting ? 'Uploading...' : 'Upload Logo'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
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

    const [form] = Form.useForm()
    const [categories, setCategories] = useState<Array<ICategory>>([])

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Store the actual File objects
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

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
            formData.append('content', form.getFieldValue('content'))

            // Append actual File objects
            if (!thumbnailFile) {
                return message.error('Please select a thumbnail image.')
            }
            formData.append('thumbnail', thumbnailFile)

            const success = await createArticle(formData)
            if (success) {
                setThumbnailFile(null)
                form.resetFields()
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
            title="Add Blog"
            open={isCreateArticleDrawerOpen}
            onClose={() => SetIsCreateArticleDrawerOpen(false)}
            footer={null}
            width={944}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}>
                <div className="h-full flex flex-col justify-between">
                    <div className="font-sans">
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Heading<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <TextItem
                                name="title"
                                type="text"
                                max={512}
                                min={4}
                                className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                placeholder="Enter title"
                                required={true}
                                onChange={inputChangeHandler('title')}
                            />
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Category<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#7f69e2'
                                    },
                                    components: {
                                        Select: {
                                            activeOutlineColor: '#7f69e2',
                                            hoverBorderColor: '#7f69e2'
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
                                        className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#dddddd]"
                                        options={categories}
                                        filterOption={filterOption}
                                        placeholder="Select category"
                                        onChange={(value) => form.setFieldsValue({ category: value })}
                                    />
                                </Form.Item>
                            </ConfigProvider>
                        </div>
                        <div className="font-sans col-span-2 h-auto mb-4">
                            <div className="font-sans  w-full">
                                <label className="font-sans text-font16 font-semibold text-gray44 mb-2">
                                    Upload Thumbnail
                                    <span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <div className="mt-2">
                                    <Form.Item
                                        name="thumbnail"
                                        rules={[{ required: true, message: 'Please select image' }]}>
                                        <UploadImgFile
                                            accept="image/png,image/jpeg"
                                            isUploading={false}
                                            onChange={(fileName) => {
                                                form.setFieldsValue({ thumbnail: fileName || '' })
                                            }}
                                            handleFileUpload={() => {
                                                return true
                                            }}
                                            onFileSelect={(file: File) => {
                                                setThumbnailFile(file)
                                            }}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="font-sans col-span-2 mb-4 h-auto">
                            <label className="font-sans text-font16 font-semibold text-gray44 mb-2">
                                Content
                                <span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Editor
                                    name="content"
                                    onChange={(value) => form.setFieldsValue({ content: value })}
                                    initialContent={''}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="font-sans grid grid-cols-2 pt-3 w-full justify-end gap-3">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => {
                                    SetIsCreateArticleDrawerOpen(false)
                                }}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>

                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
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

//
export const CreateCategoryDrawer = ({
    isCreateCategoryDrawerOpen,
    SetIsCreateCategoryDrawerOpen
}: {
    isCreateCategoryDrawerOpen: boolean
    SetIsCreateCategoryDrawerOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [dataValues, setDataValues] = useState({
        title: ''
    })
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const { title } = dataValues

    const [isSubmitting, setIsSubmitting] = useState(false)

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        if (name === 'title') {
            const categoryTitle = value
            setDataValues({
                ...dataValues,
                title: categoryTitle
            })
        } else {
            setDataValues({ ...dataValues, [name]: value })
        }
    }

    const createCategoryHandler = async () => {
        setIsSubmitting(true)
        try {
            const data = await createCategory(dataValues)
            if (data.success) {
                SetIsCreateCategoryDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer
            title="Add Category"
            open={isCreateCategoryDrawerOpen}
            onClose={() => SetIsCreateCategoryDrawerOpen(false)}
            footer={null}
            className="drawerClass"
            width={644}>
            <Form
                form={form}
                className="font-sans  flex justify-between h-full flex-col w-full"
                onFinish={createCategoryHandler}
                fields={[
                    {
                        name: 'title',
                        value: title
                    }
                ]}>
                <div className="font-sans space-y-1 md:space-y-1">
                    <label className="font-sans  text-font16 font-semibold text-gray44">
                        Category Title
                        <span className="font-sans text-red-500 pl-1">*</span>
                    </label>
                    <TextItem
                        name="name"
                        type="text"
                        className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                        placeholder="Enter Category Title"
                        required={true}
                        onChange={inputChangeHandler('title')}
                    />
                </div>

                <div className="font-sans grid grid-cols-2 w-full space-x-3  justify-end items-center">
                    <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                        <Button
                            type="default"
                            onClick={() => SetIsCreateCategoryDrawerOpen(false)}
                            className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            type="default"
                            htmlType="submit"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

//

export const EditArticleDrawer = ({
    isEditArticleDrawerOpen,
    SetIsEditArticleDrawerOpen,
    articleDetails
}: {
    articleDetails: ArticleData | null
    isEditArticleDrawerOpen: boolean
    SetIsEditArticleDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const [form] = Form.useForm()
    const articleSlug = articleDetails?.id
    const [uploadThumbnail, setUploadThumbnail] = useState<File | null>(null)
    const [categories, setCategories] = useState<Array<{ label: string; value: string }>>([])

    const [isSubmitting, setIsSubmitting] = useState(false)

    console.log(articleDetails)

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

    useEffect(() => {
        if (!articleDetails) return // Guard clause

        const controller = new AbortController()
        const signal = controller.signal

        fetchCategories(signal)

        return () => controller.abort()
    }, [articleDetails]) // Use selectedArticleId instead of articleSlug

    useEffect(() => {
        if (articleDetails) {
            setFormValues({
                title: articleDetails.title || '',
                category: articleDetails.category?.id || null,
                thumbnail: articleDetails.thumbnail || '',
                content: articleDetails.content || ''
            })
            console.log('', articleDetails.content)
            // Update AntD form values directly
            form.setFieldsValue({
                title: articleDetails.title || '',
                category: articleDetails.category?.title || null,
                thumbnail: articleDetails.thumbnail || '',
                content: articleDetails.content || ''
            })

            console.log('formValues', form.getFieldsValue())
        }
    }, [articleDetails, form])

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        setFormValues((prev) => ({ ...prev, [name]: value }))

        form.setFieldsValue({ [name]: value })
    }

    const onCategoryChange = (value: string | null) => {
        setFormValues((prev) => ({ ...prev, category: value }))
        form.setFieldsValue({ category: value })
    }

    const resetForm = () => {
        form.resetFields()
    }

    const submitBtnHandler = async () => {
        try {
            const values = await form.validateFields()
            setIsSubmitting(true)
            const payload = {
                title: values.title,

                category: categories.find((cat) => cat.value === values.category)?.value,

                content: form.getFieldValue('content'),

                thumbnail: uploadThumbnail || formValues.thumbnail
            }

            const success = await editArticle(articleSlug!, payload)

            // SetIsEditArticleDrawerOpen(false)
            if (success) {
                message.success('Article updated successfully')
                resetForm()
                SetIsEditArticleDrawerOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error: any) {
            message.error(error.message || 'Failed to update article')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filterOption = (input: any, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

    return (
        <Drawer
            title="Edit Blog"
            open={isEditArticleDrawerOpen}
            onClose={() => SetIsEditArticleDrawerOpen(false)}
            footer={null}
            width={944}>
            <Form
                form={form}
                fields={[
                    { name: 'title', value: formValues.title },
                    { name: 'category', value: formValues.category },
                    { name: 'content', value: formValues.content },
                    { name: 'thumbnail', value: formValues.thumbnail }
                ]}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}
                layout="vertical">
                <div className="flex flex-col  justify-between !pb-[10px]">
                    <div className="font-sans">
                        <div className="mb-4 space-y-1">
                            <label className="font-sans  text-font16 font-semibold text-gray44">
                                Heading<span className="text-red-500 pl-1">*</span>
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

                        <div className="mb-4 space-y-1">
                            <label className="font-sans  text-font16 font-semibold text-gray44">
                                Category<span className="text-red-500 pl-1">*</span>
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#7f69e2'
                                    },
                                    components: {
                                        Select: {
                                            activeOutlineColor: '#7f69e2',
                                            hoverBorderColor: '#7f69e2'
                                        }
                                    }
                                }}>
                                <Form.Item
                                    name="category"
                                    rules={[{ required: true, message: 'Please select category' }]}>
                                    <Select
                                        allowClear
                                        className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#dddddd]"
                                        options={categories}
                                        filterOption={filterOption}
                                        placeholder="Select Category"
                                        onChange={onCategoryChange}
                                        value={formValues.category}
                                    />
                                </Form.Item>
                            </ConfigProvider>
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <div className="font-sans  w-full">
                                <label className="font-sans text-font16 font-semibold text-gray44 mb-2">
                                    Upload Thumbnail
                                    <span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <div className="mt-2">
                                    <Form.Item
                                        key="thumbnail"
                                        name="thumbnail"
                                        rules={[{ required: false, message: 'Please select thumbnail' }]}>
                                        <UploadImgFile
                                            accept="image/png,image/jpeg"
                                            isUploading={false}
                                            handleFileUpload={() => {
                                                return true
                                            }}
                                            onFileSelect={(file: File) => {
                                                setUploadThumbnail(file)
                                            }}
                                        />

                                        {formValues.thumbnail && (
                                            <div className="mt-2">
                                                <Image
                                                    width={200}
                                                    src={formValues.thumbnail.startsWith('http') ? formValues.thumbnail : `/${uploadThumbnail}`}
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
                            <label className="font-sans  text-font16 font-semibold text-gray44">
                                Content<span className="text-red-500 pl-1">*</span>
                            </label>
                            <div className="mt-2">
                                <Editor
                                    name="content"
                                    onChange={(value) => form.setFieldsValue({ content: value })}
                                    initialContent={formValues.content}
                                />
                                {/* <TextEditor
                                name="content"
                                required={true}
                                onChange={onContentChange}
                                value={formValues.content || ''}
                            /> */}
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 grid grid-cols-2 gap-3 ">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => SetIsEditArticleDrawerOpen(false)}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
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

    // if (loading) {
    //     return <LoadingComponent />
    // }

    return (
        <Drawer
            title="Edit Testimonial"
            open={isEditTestimonialDrawerOpen}
            onClose={() => SetIsEditTestimonialDrawerOpen(false)}
            footer={null}
            width={644}>
            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingOutlined
                        style={{ fontSize: 24 }}
                        spin
                    />
                </div>
            ) : (
                <Form
                    form={form}
                    fields={[
                        { name: 'name', value: formValues.name },
                        { name: 'designation', value: formValues.designation },
                        { name: 'description', value: formValues.description },
                        { name: 'image', value: formValues.image }
                    ]}
                    className="font-sans w-full flex justify-between flex-col h-full"
                    onFinish={submitBtnHandler}
                    layout="vertical">
                    <div className="font-sans flex flex-col justify-between h-full">
                        <div className="">
                            <div className="mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Name<span className="font-sans text-red-500pl-1">*</span>{' '}
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

                            <div className="mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
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

                            <div className="mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Description<span className="text-red-500pl-1">*</span>
                                </label>
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'Please enter description' }]}>
                                    <TextAreaItem
                                        name="description"
                                        placeholder="Enter description"
                                        className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                        onChange={(e) => {
                                            const value = e.target.value
                                            form.setFieldsValue({ description: value })
                                        }}
                                        required={true}
                                    />
                                </Form.Item>
                            </div>

                            <div className="font-sans col-span-2 h-auto">
                                <div className="font-sans w-full">
                                    <label className="font-sans text-font16 font-semibold text-gray44 mb-2">
                                        Image<span className="font-sans text-red-500pl-1">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <Form.Item
                                            name="image"
                                            rules={[{ required: true, message: 'Please select image' }]}>
                                            <UploadImgFile
                                                accept="image/png,image/jpeg"
                                                isUploading={false}
                                                onChange={(fileName) => {
                                                    form.setFieldsValue({ image: fileName || '' })
                                                }}
                                                handleFileUpload={async (file) => {
                                                    setImageFile(file)
                                                    // Your upload logic here if needed
                                                    return true
                                                }}
                                                onFileSelect={function (): void {
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
                        </div>

                        <div className=" grid grid-cols-2 gap-2">
                            <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                                <Button
                                    onClick={() => navigate('/dashboard/testimonials')}
                                    type="default"
                                    className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                    Cancel
                                </Button>
                            </ButtonThemeConfig>
                            <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                    disabled={isSubmitting}
                                    className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                    {' '}
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </Button>
                            </ButtonThemeConfig>
                        </div>
                    </div>
                </Form>
            )}
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

    const faqId = selectedFaqId
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchFaqDetails = async () => {
        try {
            setLoading(true)
            const data = await getFaqById(faqId as string)

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
            title="Edit FAQ"
            open={isEditFaqDrawerOpen}
            onClose={() => SetIsEditFaqDrawerOpen(false)}
            footer={null}
            width={644}>
            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingOutlined
                        style={{ fontSize: 24 }}
                        spin
                    />
                </div>
            ) : (
                <Form
                    form={form}
                    className="font-sans w-full flex justify-between flex-col h-full"
                    onFinish={submitBtnHandler}>
                    <div className="font-sans space-y-6">
                        <div className="space-y-4">
                            {/* Question Field */}
                            <div className="space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Question<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <TextItem
                                    name="question"
                                    type="text"
                                    max={512}
                                    min={4}
                                    placeholder="Enter the question..."
                                    required={true}
                                    onChange={inputChangeHandler('question')}
                                />
                            </div>

                            {/* Answer Field */}
                            <div className="space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Answer<span className="font-sans text-red-500 pl-1">*</span>
                                </label>

                                <TextAreaItem
                                    name="answer"
                                    required
                                    onChange={() => {}}
                                    className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                    placeholder="Write the detailed answer here..."
                                />
                            </div>

                            {/* Page Dropdown */}
                            <div className="space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Page<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#7f69e2'
                                        },
                                        components: {
                                            Select: {
                                                activeOutlineColor: '#7f69e2',
                                                hoverBorderColor: '#7f69e2'
                                            }
                                        }
                                    }}>
                                    <Form.Item
                                        name="pageName"
                                        rules={[{ required: true, message: 'Please select a page' }]}>
                                        <Select
                                            allowClear
                                            className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#dddddd]"
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
                    </div>

                    {/* Submit & Cancel Buttons */}
                    <div className="font-sans w-full justify-end grid grid-cols-2 gap-4">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => SetIsEditFaqDrawerOpen(false)}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>

                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
                                style={{ width: 'auto' }}>
                                {isSubmitting ? 'Updating...' : 'Update FAQ'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </Form>
            )}
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

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    return (
        <Drawer
            title="Add Careers"
            open={isCreateCareerDrawerOpen}
            onClose={() => SetIsCreateCareerDrawerOpen(false)}
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                layout="vertical"
                onFinish={handleSubmit}>
                <div className="h-full flex flex-col justify-between">
                    <div className="font-sans">
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Job Role<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <Form.Item
                                name="jobrole"
                                className="font-sans w-full">
                                <TextItem
                                    placeholder="e.g., Account Manager"
                                    name="jobrole"
                                    className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                    required={false}
                                    onChange={inputChangeHandler('jobrole')}
                                />
                            </Form.Item>
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Employment Type<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#7f69e2'
                                    },
                                    components: {
                                        Select: {
                                            activeOutlineColor: '#4226C4',
                                            hoverBorderColor: '#4226C4'
                                        }
                                    }
                                }}>
                                <Form.Item
                                    name="employmentType"
                                    className="font-sans w-full">
                                    <Select
                                        placeholder="Select employment type"
                                        options={[
                                            { value: 'Full Time', label: 'Full Time' },
                                            { value: 'Part Time', label: 'Part Time' },
                                            { value: 'Internship', label: 'Internship' }
                                        ]}
                                        className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#4226C4]"
                                    />
                                </Form.Item>
                            </ConfigProvider>
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Location<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <Form.Item
                                name="location"
                                className="font-sans w-full">
                                <TextItem
                                    className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                    onChange={inputChangeHandler('location')}
                                    placeholder="e.g., Bengaluru, India"
                                    name="location"
                                    required={true}
                                />
                            </Form.Item>
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Experience<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <Form.Item
                                name="experience"
                                className="font-sans w-full">
                                <TextItem
                                    placeholder="e.g., 2–5 years"
                                    name="experience"
                                    className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                    required={true}
                                    onChange={inputChangeHandler('experience')}
                                />
                            </Form.Item>
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Job Description<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <Form.Item
                                name="jobDescription"
                                className="font-sans w-full">
                                <TextAreaItem
                                    name="jobDescription"
                                    placeholder="Describe responsibilities, skills, qualifications..."
                                    className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        form.setFieldsValue({ description: value })
                                    }}
                                    required={true}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 justify-end gap-4">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => SetIsCreateCareerDrawerOpen(false)}
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                {isSubmitting ? 'Creating...' : 'Create'}
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </div>
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

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }

    return (
        <Drawer
            title="Edit Careers"
            open={isEditCareerDrawerOpen}
            onClose={() => SetIsEditCareerDrawerOpen(false)}
            width={644}>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{}}
                className="font-sans w-full flex justify-between flex-col h-full">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <LoadingOutlined
                            style={{ fontSize: 24 }}
                            spin
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col justify-between">
                        <div className="font-sans">
                            <div className="font-sans mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Job Role<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <Form.Item
                                    name="jobrole"
                                    className="font-sans w-full"
                                    rules={[{ required: true, message: 'Please enter job role' }]}>
                                    <TextItem
                                        placeholder="e.g., Account Manager"
                                        name="jobrole"
                                        required={false}
                                        className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                        onChange={inputChangeHandler('jobrole')}
                                    />
                                </Form.Item>
                            </div>

                            <div className="font-sans mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Employment Type<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#7f69e2'
                                        },
                                        components: {
                                            Select: {
                                                activeOutlineColor: '#7f69e2',
                                                hoverBorderColor: '#7f69e2'
                                            }
                                        }
                                    }}>
                                    <Form.Item
                                        name="employmentType"
                                        className="font-sans w-full"
                                        rules={[{ required: true, message: 'Please select employment type' }]}>
                                        <Select
                                            placeholder="Select employment type"
                                            options={[
                                                { value: 'Full-time', label: 'Full Time' },
                                                { value: 'Part-time', label: 'Part Time' },
                                                { value: 'Contract', label: 'Contract' }
                                            ]}
                                            className="font-sans text-font16 text-[#1c1c1c] font-semibold w-[256px] h-[48px] rounded-lg border-2 border-[#DDD] hover:border-[#dddddd]"
                                        />
                                    </Form.Item>
                                </ConfigProvider>
                            </div>

                            <div className="font-sans mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Location<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <Form.Item
                                    name="location"
                                    className="font-sans w-full"
                                    rules={[{ required: true, message: 'Please enter location' }]}>
                                    <TextItem
                                        placeholder="e.g., Bengaluru, India"
                                        name="location"
                                        required={false}
                                        className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                        onChange={inputChangeHandler('location')}
                                    />
                                </Form.Item>
                            </div>

                            <div className="font-sans mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Experience<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <Form.Item
                                    name="experience"
                                    className="font-sans w-full"
                                    rules={[{ required: true, message: 'Please enter experience' }]}>
                                    <TextItem
                                        name="experience"
                                        required={true}
                                        className="h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500 font-semibold"
                                        onChange={inputChangeHandler('experience')}
                                        value={form.getFieldValue('experience')}
                                        placeholder="e.g., 2–5 years"
                                    />
                                </Form.Item>
                            </div>

                            <div className="font-sans mb-4 space-y-1">
                                <label className="font-sans text-font16 font-semibold text-gray44">
                                    Job Description<span className="font-sans text-red-500 pl-1">*</span>
                                </label>
                                <Form.Item
                                    name="jobDescription"
                                    className="font-sans w-full"
                                    rules={[{ required: true, message: 'Please enter job description' }]}>
                                    <TextAreaItem
                                        name="jobDescription"
                                        placeholder="Describe responsibilities, skills, qualifications..."
                                        className="w-full !h-[256px] p-2  font-sans text-font16 rounded-[6px] text-[#444444] focus:border-[#dddddd] hover:border-[#dddddd] border-2 border-[#dddddd] focus-visible:shadow-none transition ease-in duration-500"
                                        onChange={(e) => {
                                            const value = e.target.value
                                            form.setFieldsValue({ description: value })
                                        }}
                                        required={true}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 justify-end gap-4">
                            <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                                <Button
                                    onClick={() => SetIsEditCareerDrawerOpen(false)}
                                    className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                    Cancel
                                </Button>
                            </ButtonThemeConfig>
                            <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || loading}
                                    className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                    {isSubmitting ? 'Updating...' : 'Update'}
                                </Button>
                            </ButtonThemeConfig>
                        </div>
                    </div>
                )}
            </Form>
        </Drawer>
    )
}

export const EditCategoryDrawer = ({
    isEditCategoryDrawerOpen,
    SetIsEditCategoryDrawerOpen,
    categoryDetails
}: {
    isEditCategoryDrawerOpen: boolean
    categoryDetails: ICategory | null
    SetIsEditCategoryDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()

    const categoryId = categoryDetails?.id
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const submitBtnHandler = async (values: any) => {
        // Ant Design passes validated values directly to onFinish
        try {
            setIsSubmitting(true)

            const payload = {
                title: values.name.trim()
            }

            const success = await editCategory(categoryId!, payload)

            if (success) {
                message.success('Category updated successfully')
                dispatch(setIsDataRefreshed(!isDataRefreshed))
                SetIsEditCategoryDrawerOpen(false)
                form.resetFields() // Optional: clear form on close
            }
        } catch (error: any) {
            message.error({
                content: error.message || 'Failed to update category. Please try again.',
                duration: 8
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (categoryDetails) {
            form.setFieldsValue({
                name: categoryDetails.title || ''
            })
        } else {
            form.resetFields()
        }
    }, [categoryDetails, form])

    const [formValues, setFormValues] = useState<{ name: string }>({ name: '' })

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value

        setFormValues((prev) => ({ ...prev, [name]: value }))
        form.setFieldsValue({ [name]: value })
    }

    console.log(categoryDetails, 'categoryDetails')

    return (
        <Drawer
            title="Edit Category"
            open={isEditCategoryDrawerOpen}
            onClose={() => SetIsEditCategoryDrawerOpen(false)}
            footer={null}
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}
                layout="vertical">
                <div className="font-sans space-y-6">
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter a category title' },
                            { whitespace: true, message: 'Category title cannot be empty' }
                        ]}>
                        <label className="font-sans text-font16 font-semibold text-gray44 pb-1">
                            Category Title
                            <span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            placeholder="Enter Category Title"
                            name="name"
                            required={false}
                            value={formValues.name}
                            onChange={inputChangeHandler('name')}
                        />
                    </Form.Item>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="font-sans pt-6 w-full justify-end grid grid-cols-2 gap-4">
                    <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                        <Button
                            onClick={() => SetIsEditCategoryDrawerOpen(false)}
                            type="default"
                            className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                            Cancel
                        </Button>
                    </ButtonThemeConfig>

                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                            disabled={isSubmitting}
                            className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
                            style={{ width: 'auto' }}>
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </Button>
                    </ButtonThemeConfig>
                </div>
            </Form>
        </Drawer>
    )
}

export const CreateUserDrawer = ({
    isCreateUserDrawerOpen,
    SetIsCreateUserDrawerOpen
}: {
    isCreateUserDrawerOpen: boolean
    SetIsCreateUserDrawerOpen: Dispatch<boolean>
}) => {
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const dispatch = useDispatch()
    const permissionsList = ['Overview', 'Blogs', 'Blog Categories', 'Testimonials', "FAQ's", 'Careers', 'Client Logo', 'Manage Users']

    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [permissions, setPermissions] = useState<string[]>([])

    const inputChangeHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value
        form.setFieldsValue({ [name]: value })
    }
    const togglePermission = (perm: string) => {
        if (permissions.includes(perm)) {
            setPermissions(permissions.filter((p) => p !== perm))
        } else {
            setPermissions([...permissions, perm])
        }
    }

    const submitBtnHandler = async () => {
        try {
            setIsSubmitting(true)
            const values = await form.validateFields()

            const payload = {
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password
            }

            const result = await createUsers(payload)
            if (result?.success) {
                form.resetFields()
                dispatch(setIsDataRefreshed(!isDataRefreshed))
                SetIsCreateUserDrawerOpen(false)
            }
        } catch (error: any) {
            console.error('Submission error:', error)
            message.error(error?.message || 'Failed to create user. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Drawer
            title="Add Users"
            open={isCreateUserDrawerOpen}
            onClose={() => SetIsCreateUserDrawerOpen(false)}
            footer={null}
            width={644}>
            <Form
                form={form}
                className="font-sans w-full flex justify-between flex-col h-full"
                onFinish={submitBtnHandler}>
                <div className="h-full flex flex-col justify-between">
                    <div className="font-sans">
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Name<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <TextItem
                                name="name"
                                type="text"
                                max={512}
                                min={4}
                                placeholder="Enter name"
                                required={true}
                                onChange={inputChangeHandler('name')}
                            />
                        </div>

                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Email<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <TextItem
                                name="email"
                                type="email"
                                max={512}
                                min={4}
                                placeholder="Enter email"
                                required={true}
                                onChange={inputChangeHandler('email')}
                            />
                        </div>
                        <div className="font-sans mb-4 space-y-1">
                            <label className="font-sans text-font16 font-semibold text-gray44">
                                Password<span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <PasswordInput
                                name="password"
                                placeholder="Enter Password"
                                required={true}
                                onChange={inputChangeHandler('password')}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="font-semibold text-gray-600 mb-2 block">Assign Permissions</label>
                            <div className="flex flex-wrap gap-3">
                                {permissionsList.map((perm) => (
                                    <div
                                        key={perm}
                                        onClick={() => togglePermission(perm)}
                                        className={`cursor-pointer px-4 py-2 rounded-md font-semibold transition-colors ${
                                            permissions.includes(perm) ? 'bg-[#4226C4] text-white' : 'bg-[#FFEBFB] text-gray-600'
                                        }`}>
                                        {perm}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="font-sans grid grid-cols-2 pt-3 w-full justify-end gap-3">
                        <ButtonThemeConfig buttonType={EConfigButtonType.SECONDARY}>
                            <Button
                                onClick={() => {
                                    navigate('/dashboard/articles')
                                }}
                                type="default"
                                className="font-sans h-auto !rounded-[100px] bg-white text-primary border-primary text-base shadow-none flex justify-center item-center px-6 py-4">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>

                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                icon={isSubmitting ? <LoadingOutlined spin /> : undefined}
                                disabled={isSubmitting}
                                className="font-sans h-auto w-full !rounded-[100px] bg-primary !hover:bg-primary text-white border-primary text-base shadow-none flex justify-center item-center px-6 py-4"
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
