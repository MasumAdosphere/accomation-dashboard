import { Rule } from 'antd/es/form'
import JoditReact from 'jodit-react-ts'
import { Suspense, useMemo } from 'react'
import 'react-phone-input-2/lib/style.css'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import { UploadOutlined } from '@ant-design/icons'
import { ButtonThemeConfig } from './configs.components.js'
import PhoneInput, { CountryData } from 'react-phone-input-2'
import { EConfigButtonType } from '../../types/state.types.ts'
import { Button, Form, Input, Select, ConfigProvider, Upload, UploadProps } from 'antd'
import { PasswordInputProps, PhoneProps, TextAreaItemProps, TextItemProps } from '../../types/form.components.types.ts'

export const PasswordInput = ({ name, required = true, placeholder, icon, onChange, regex, newPwd = null }: PasswordInputProps) => {
    const rules: {
        required?: boolean
        message: string

        pattern?: RegExp
    }[] = [{ required, message: `Please enter your password` }]

    if (regex) {
        rules.push({
            pattern: regex,
            message: `Password must contain  a mixture of letters, numbers and symbols`
        })
    }
    if (newPwd) {
        rules.push({
            pattern: new RegExp(`^${newPwd}$`),
            message: 'Your password does not match the new password'
        })
    }

    return (
        <Form.Item
            name={name}
            className="w-full"
            rules={rules}>
            <Input.Password
                className="h-10 2xl:h-12  text-sm 2xl:text-base rounded-lg font-dmSans border border-[#e5e5e6] focus-within:shadow-none focus:border-[#868E96] hover:border-[#868E96] focus-within:border-[#868E96]  transition ease-in duration-500"
                placeholder={placeholder}
                autoComplete="off"
                prefix={icon}
                onChange={onChange}
            />
        </Form.Item>
    )
}

export const TextItem = ({
    name,
    required = true,
    min,
    max,
    value,
    icon,
    allowClear = false,
    type = 'text',
    className,
    onChange,
    suffix,
    readOnly = false,
    regex,
    regexMsg,
    placeholder,
    defaultValue
}: TextItemProps) => {
    const rules: Rule[] = [{ required, message: `Please enter ${Array.isArray(name) ? name[1] : name}` }]

    // Safe label for error messages
    const fieldLabel = Array.isArray(name) ? String(name[name.length - 1]) : name

    const capitalizedLabel = fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)

    if (min) {
        rules.push({
            min,
            message: `${capitalizedLabel} must be more than ${min} characters`
        })
    }

    if (max) {
        rules.push({
            max,
            message: `${capitalizedLabel} must be under ${max} characters`
        })
    }

    if (type === 'email') {
        rules.push({
            type,
            message: `Please enter valid email address`
        })
    }
    if (regex) {
        rules.push({
            pattern: regex,
            message: regexMsg ? regexMsg : `Please enter proper content`
        })
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#083050'
                }
            }}>
            <Form.Item
                name={name}
                className="w-full"
                rules={rules}>
                <Input
                    type={type}
                    prefix={icon}
                    suffix={suffix}
                    readOnly={readOnly}
                    defaultValue={defaultValue}
                    autoComplete="off"
                    allowClear={allowClear}
                    value={value}
                    onChange={onChange}
                    className={
                        className
                            ? className
                            : 'h-10 2xl:h-12 font-sans text-lg rounded-lg font-dmSans border border-[#e5e5e6] focus-visible:shadow-none focus:border-[#868E96] hover:border-[#868E96] transition ease-in duration-500'
                    }
                    placeholder={placeholder}
                />
            </Form.Item>
        </ConfigProvider>
    )
}

export const TextAreaItem = ({ name, required = true, min, max, onChange, placeholder }: TextAreaItemProps) => {
    const fieldLabel = Array.isArray(name) ? String(name[name.length - 1]) : name

    const capitalizedLabel = fieldLabel.charAt(0) + fieldLabel.slice(1)

    const rules: {
        required?: boolean
        message: string
        min?: number
        max?: number
    }[] = [{ required, message: `Please enter ${capitalizedLabel}.` }]

    if (min) {
        rules.push({
            min,
            message: `${capitalizedLabel} must be more than ${min} characters`
        })
    }

    if (max) {
        rules.push({
            max,
            message: `${capitalizedLabel} must be under ${max} characters`
        })
    }

    return (
        <Form.Item
            name={name}
            className="w-full"
            rules={rules}>
            <TextArea
                placeholder={placeholder}
                rows={3}
                className="h-8 2xl:h-12 text-base"
                onChange={onChange}
            />
        </Form.Item>
    )
}

export const SubmitButton = ({ text, className }: { text: string; className?: string }) => {
    return (
        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
            <Button
                type="default"
                htmlType="submit"
                className={
                    className
                        ? className
                        : 'w-full font-sans h-auto bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2'
                }>
                {text}
            </Button>
        </ButtonThemeConfig>
    )
}

export const PhoneNumberItem = ({ name = 'phone', contact, required, onChange }: PhoneProps) => {
    return (
        <Form.Item
            name={name}
            className="w-full"
            rules={required ? [{ required: true, message: 'Please enter your phone number' }] : []}>
            <PhoneInput
                placeholder="Enter your number"
                country={'in'}
                countryCodeEditable={false}
                value={contact.phone}
                onChange={(phone, country) => onChange(phone, country as CountryData)}
                inputStyle={{ width: '100%', height: '48px' }}
            />
        </Form.Item>
    )
}

export const DropdownSelector = ({
    allowClear = true,
    items,
    required,
    mode,
    name,
    placeholder,
    handleChange,
    value,
    defaultValue,
    placement = 'bottomRight'
}: {
    items: Array<{ key: string; label: string; value: string }>
    defaultValue?: string
    name: string
    mode?: 'multiple' | 'tags' | undefined
    value?: string
    placement?: 'bottomRight' | 'bottomLeft' | 'topLeft' | 'topRight'
    height?: string
    placeholder: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: any
    allowClear?: boolean
    required: boolean
}) => {
    return (
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
                key={name}
                name={name}
                className="font-sans w-full"
                rules={required ? [{ required: true, message: 'Please select this option!' }] : []}>
                <Select
                    className="font-sans text-sm 2xl:text-lg h-10 2xl:h-12 w-full rounded custom-select"
                    optionLabelProp="label"
                    placeholder={placeholder}
                    allowClear={allowClear}
                    onChange={handleChange}
                    options={items}
                    defaultValue={defaultValue}
                    value={value}
                    mode={mode}
                    showSearch={true}
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    placement={placement}
                />
            </Form.Item>
        </ConfigProvider>
    )
}

export const TextEditor = ({
    value = '',
    onChange,
    name,
    required = false
}: {
    value?: string | null
    onChange: (content: string) => void
    name: string
    required: boolean
}) => {
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start typing...',

            uploader: {
                insertImageAsBase64URI: true
            },
            toolbar: true,
            buttons: ['bold', 'italic', 'underline', 'strikethrough', 'hr', 'eraser', 'ul', 'ol', 'table', 'image', 'video', 'link'],
            toolbarButtonSize: 'large',
            speechRecognize: {
                api: null
            }
        }),
        []
    )

    const rules = required
        ? [
              { required: true, message: `Please enter article content` },
              {
                  validator: (_: any, textValue: string) => {
                      if (textValue && textValue.length >= 1) {
                          return Promise.resolve()
                      }
                      return Promise.reject(new Error('Content must be at least 1 characters long!'))
                  }
              }
          ]
        : []

    return (
        <Form.Item
            className="font-sans w-full"
            rules={rules}
            name={name}>
            <Suspense fallback={<div>Loading...</div>}>
                <JoditReact
                    config={config}
                    defaultValue={value as string}
                    onChange={(newContent) => onChange(newContent)}
                />
            </Suspense>
        </Form.Item>
    )
}

interface UploadImgFileProps {
    handleFileUpload: (file: File) => boolean | Promise<boolean>
    accept: string
    isUploading: boolean
    // fileList?: UploadFile[]
}
export const UploadImgFile: React.FC<UploadImgFileProps> = ({ handleFileUpload, accept, isUploading }) => {
    const props: UploadProps = {
        listType: 'picture',
        accept,
        showUploadList: true,
        // fileList,
        beforeUpload: async (file) => {
            await handleFileUpload(file)
            return false // prevent Ant Design's auto-upload
        },
        previewFile: async (file) => {
            // Optional custom preview logic
            const blob = new Blob([file])
            return URL.createObjectURL(blob) // generates a preview URL
        }
    }

    return (
        <Upload
            {...props}
            maxCount={1}>
            <Button
                icon={<UploadOutlined />}
                loading={isUploading}
                disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
        </Upload>
    )
}

export const MediaGallery = ({ handleFileUpload, accept, isUploading }: UploadImgFileProps) => {
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        accept,
        showUploadList: true,
        beforeUpload: async (file) => {
            await handleFileUpload(file)
            return false // prevent auto-upload
        },
        previewFile: async (file) => {
            const blob = new Blob([file])
            return URL.createObjectURL(blob)
        }
    }

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <UploadOutlined />
            </p>
            <p className="ant-upload-text">{isUploading ? 'Uploading...' : 'Click or drag files to upload'}</p>
            <p className="ant-upload-hint">Supports files (.jpeg,.jpg,.png.)</p>
        </Dragger>
    )
}
