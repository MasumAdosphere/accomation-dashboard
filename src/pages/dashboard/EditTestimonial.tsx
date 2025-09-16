import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Form, Image, message } from 'antd'

import { LoadingOutlined } from '@ant-design/icons'
import { EConfigButtonType } from '../../types/state.types'
import { editTestimonials, getTestimonialById } from '../../redux/testimonials/testimonial.thunk'
import LoadingComponent from '../../components/custom/loadingComponent'
import { TextItem, UploadImgFile } from '../../components/antdesign/form.components'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'

const EditTestimonials = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const { testimonialId } = useParams()

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
                navigate('/dashboard/testimonials')
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
        <div>
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
        </div>
    )
}

export default EditTestimonials
