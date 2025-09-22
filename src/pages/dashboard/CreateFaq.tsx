'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfigProvider, Form, message, Select } from 'antd'
import { EConfigButtonType } from '../../types/state.types'
import { createFaq } from '../../redux/faq/faq.thunk'
import { ButtonThemeConfig } from '../../components/antdesign/configs.components'
import { LoadingOutlined } from '@ant-design/icons'
import { TextItem } from '../../components/antdesign/form.components'

const CreateFaq = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)

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
        <div>
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
        </div>
    )
}

export default CreateFaq
