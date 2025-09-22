'use client'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, Form, message, Upload } from 'antd'
import { EConfigButtonType } from '../../types/state.types'
import { createLogo } from '../../redux/logo/logo.thunk'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { TextItem, UploadImgFile } from '../../components/antdesign/form.components'
import { LoadingOutlined } from '@ant-design/icons'

const CreateLogo = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isUploading, setIsUploading] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null) // 👈 Store actual File object

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

            console.log('📤 Submitting Logo FormData:', Object.fromEntries(formData.entries()))

            const success = await createLogo(formData) // 👈 Sends FormData, not JSON

            if (success) {
                setLogoFile(null)
                form.resetFields()
                navigate('/dashboard/logo')
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
        <div>
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
        </div>
    )
}

export default CreateLogo
