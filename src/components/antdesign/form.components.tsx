import { Rule } from 'antd/es/form'
import JoditReact from 'jodit-react-ts'
import { Dispatch, ReactNode, Suspense, useMemo, useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ButtonThemeConfig } from './configs.components.js'
import PhoneInput, { CountryData } from 'react-phone-input-2'
import { EConfigButtonType, EMediaType, IGallery } from '../../types/state.types.ts'
import { Button, Form, Input, Select, ConfigProvider, Upload, UploadProps, message } from 'antd'
import { PasswordInputProps, PhoneProps, TextAreaItemProps, TextItemProps } from '../../types/form.components.types.ts'
import { fetchGallery, fileUpload } from '../../redux/gallery/gallery.thunk.ts'

export const PasswordInput = ({ name, required = true, placeholder, icon, onChange, regex, className, newPwd = null }: PasswordInputProps) => {
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
            className={
                className
                    ? className
                    : 'h-[52px]  w-full font-sans text-font16 rounded-[6px] text-[#444444] hover:border-[#e7e7e7]  border border-[#e7e7e7] focus-visible:shadow-none transition ease-in duration-500'
            }
            rules={rules}>
            <Input.Password
                className="h-[52px]  font-sans text-font16 rounded-[6px] text-[#444444] hover:border-[#e7e7e7]  border border-[#e7e7e7] focus-visible:shadow-none transition ease-in duration-500"
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
                    colorPrimary: '#7f69e2'
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
                            : 'h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#444444] border-[#ddd] border-2 transition ease-in duration-500'
                    }
                    placeholder={placeholder}
                />
            </Form.Item>
        </ConfigProvider>
    )
}

export const TextAreaItem = ({ name, required = true, min, max, onChange, placeholder, className }: TextAreaItemProps) => {
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
                onChange={onChange}
                className={
                    className
                        ? className
                        : 'h-10 2xl:h-12 font-sans text-font16 rounded-[6px] text-[#919191] hover:border-[#e7e7e7]  border border-[#e7e7e7] focus-visible:shadow-none transition ease-in duration-500'
                }
            />
        </Form.Item>
    )
}

export const SubmitButton = ({ text, className, icon, disabled }: { text: string; className?: string; icon?: ReactNode; disabled: boolean }) => {
    return (
        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
            <Button
                icon={icon}
                type="default"
                htmlType="submit"
                disabled={disabled}
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

interface UploadImgFileProps {
    handleFileUpload: (file: File) => boolean | Promise<boolean>
    accept: string
    isUploading: boolean
    value?: string
    className?: string
    onChange?: (value: string | null) => void // Add onChange prop
    onFileSelect: (file: File) => void // Simple callback - no return value needed

    // fileList?: UploadFile[]
}
export const UploadImgFile: React.FC<UploadImgFileProps> = ({ accept, isUploading, onFileSelect, handleFileUpload, onChange, className, value }) => {
    const props: UploadProps = {
        listType: 'picture',
        accept,
        showUploadList: true,
        maxCount: 1,
        beforeUpload: async (file) => {
            try {
                if (handleFileUpload) {
                    await handleFileUpload(file)
                }
                if (onFileSelect) {
                    onFileSelect(file)
                }
                if (onChange) {
                    onChange(file.name) // This will update the parent and remove validation error
                }
            } catch (error) {
                console.error('Upload failed:', error)
            }
            return false // Prevent automatic upload
        },
        previewFile: async (file) => {
            const blob = new Blob([file])
            return URL.createObjectURL(blob)
        },
        onRemove(_file) {
            if (onChange) {
                onChange(null)
            }
        }
    }

    const fileName = value

    return (
        <Upload {...props}>
            <div
                className={`border-2 border-[#e7e7e7] w-full rounded-md py-1.5 px-2.5 flex items-center justify-between cursor-pointer ${className}`}
                style={{
                    minHeight: '48px',
                    background: 'white'
                }}>
                <span className="text-font15 font-medium text-[#cccccc] font-Metropolis">{fileName ? fileName : 'Select Image'}</span>
                <Button
                    type="default"
                    size="small"
                    className="!bg-[#EBEBEB] !rounded-[5px] !text-font14 !text-[#515151] !font-semibold border-[#EBEBEB] !px-3 !py-2 border hover:!border-[#4226C4] hover:!bg-white"
                    loading={isUploading}
                    disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Choose File'}
                </Button>
            </div>
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
              { required: true, message: `Please enter news content` },
              {
                  validator: (_: any, textValue: string) => {
                      if (textValue && textValue.length >= 12) {
                          return Promise.resolve()
                      }
                      return Promise.reject(new Error('News content must be at least 12 characters long!'))
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

const beforeUpload = (file: File) => {
    const isMp4 = file.type === 'video/mp4'
    const isJpgOrJpeg =
        file.type === 'image/jpeg' ||
        file.type === 'image/gif' ||
        file.type === 'image/webp' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'

    let isValidType = false
    let isValidSize = false

    // Check for MP4 file type and size
    if (isMp4) {
        isValidType = true
        isValidSize = file.size / (1024 * 1024) < 20 // 20MB for MP4
        if (!isValidSize) {
            message.error('Video must be smaller than 20 MB!')
        }
    }
    // Check for JPG/JPEG file type and size
    else if (isJpgOrJpeg) {
        isValidType = true
        isValidSize = file.size / (1024 * 1024) < 5 // 5MB for JPG/JPEG
        if (!isValidSize) {
            message.error('Image must be smaller than 1 MB!')
        }
    }
    // File type is invalid
    else {
        message.error('You can only upload MP4, JPG, or JPEG files!')
    }

    return isValidType && isValidSize
}

export const ImageUpload = ({
    setFiles,
    setTotalPages,
    setImage,
    modalType
}: {
    setFiles: Dispatch<IGallery[]>
    setTotalPages: Dispatch<number>
    setImage: Dispatch<string>
    modalType: EMediaType | ''
}) => {
    const [loading, setLoading] = useState(false)

    const handleUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fileUpload(formData)
            const controller = new AbortController()
            const signal = controller.signal

            if (response) {
                message.success('Upload successful!')
                const data = await fetchGallery(50, 1, null, modalType, signal)
                if (data) {
                    setTotalPages(data.totalPages)
                    setFiles(data.medias)
                }
                setImage(response.data)
            }
            return () => {
                controller.abort()
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true)
            return
        }
        if (info.file.status === 'done') {
            handleUpload(info.file.originFileObj)
        }
    }

    const uploadButton = (
        <button
            className="border-none bg-darkblue text-white bg-none h-12 w-[150px] rounded-[40px] flex items-center justify-center gap-5"
            type="button">
            {loading ? <LoadingOutlined /> : <></>}
            <div>Upload</div>
        </button>
    )

    return (
        <div className="file-uploader">
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#F37167',
                        borderRadius: 40,
                        colorText: '#112D93',
                        colorBorder: 'none',
                        fontFamily: 'Noto Sans Gujarati, sans-serif'
                        // colorFillAlter: '#F6F8FD'
                    },
                    components: {
                        Upload: {
                            // actionsColor: "#F6F8FD",
                        }
                    }
                }}>
                <Upload
                    name="file"
                    accept={`${modalType === EMediaType.VIDEO ? '.mp4' : modalType === EMediaType.IMAGE ? '.jpg, .png, .gif, .webp' : ''} `}
                    listType="picture-card"
                    className="font-sans text-lg"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={({ onSuccess }) => {
                        setTimeout(() => {
                            onSuccess?.('ok')
                        }, 0)
                    }}>
                    {uploadButton}
                </Upload>
            </ConfigProvider>
        </div>
    )
}
