import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, message } from 'antd'
import { EConfigButtonType, ICategory } from '../../types/state.types'
import { LoadingOutlined } from '@ant-design/icons'
import { createTestimonials } from '../../redux/testimonials/testimonial.thunk'
import { getAllCategories } from '../../redux/category/category.thunk'
import { TextItem, UploadImgFile } from '../../components/antdesign/form.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'

const CreateTestimonials = () => {
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
                className="font-sans w-full flexjustify-between flex-col h-full mt-4"
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
        </div>
    )
}

export default CreateTestimonials
