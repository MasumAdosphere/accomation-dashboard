// src/components/Editor.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { useEffect, useState } from 'react'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { XEmbed } from '../../extensions/XEmbed'
import { InstagramEmbed } from '../../extensions/InstagramEmbed'
import { Popover, Select } from 'antd'
import Link from '@tiptap/extension-link'
import GetImgUrlModal from '../custom/GetImgUrlModal'
import { EMediaType } from '../../types/state.types'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from '../../extensions/FontSize'

interface EditorProps {
    name?: string
    onChange?: (html: string, json: any) => void
    initialContent: string
}
export default function Editor({ onChange, initialContent }: EditorProps) {
    const [embedType, setEmbedType] = useState('youtube')
    const [url, setUrl] = useState('')
    const [hyperLink, setHyperLink] = useState('')
    const [galleryModalOpen, setGalleryModalOpen] = useState(false)

    // Handle URL change
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value)
    }
    const handleHyperLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHyperLink(e.target.value)
    }
    // Handle embed type selection
    const handleTypeChange = (type: string) => {
        setEmbedType(type)
        setUrl('') // Reset URL when changing type
    }
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
            Underline,
            Link.configure({
                openOnClick: false
            }),
            Image.configure({
                allowBase64: true,
                inline: true
            }),
            InstagramEmbed,
            Youtube.configure({ width: 640, height: 360 }),
            XEmbed, // Add your custom X (Twitter) embed extension
            Table.configure({
                HTMLAttributes: {
                    class: 'tiptap-table'
                }
            }),
            TableRow,
            TextStyle,
            TableCell,
            FontSize,
            TableHeader
        ],
        content: initialContent,

        onUpdate({ editor }) {
            const html = editor.getHTML()
            const json = editor.getJSON() // Get JSON content
            onChange?.(html, json) // Pass both HTML and JSON
        }
    })

    useEffect(() => {
        if (editor && initialContent !== undefined && initialContent !== null) {
            const current = editor.getHTML()
            // Avoid resetting if content is the same (prevents cursor jump)
            if (current !== initialContent) {
                editor.commands.setContent(initialContent)
            }
        }
    }, [editor, initialContent])

    if (!editor) return null

    if (!editor) return null
    const handleEmbed = () => {
        if (!url) return

        switch (embedType) {
            case 'youtube':
                if (!url) return

                // Basic YouTube URL validation
                const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i

                if (!youtubeRegex.test(url)) {
                    alert('Please enter a valid YouTube URL.')
                    return
                }

                editor.chain().focus().setYoutubeVideo({ src: url }).run()
                setUrl('')
                break
            case 'twitter':
                if (!url) return //@ts-ignore
                editor.commands.setXEmbed({ url: url })
                setUrl('')
                break
            case 'instagram':
                if (!url) return //@ts-ignore
                editor.commands.setInstagramEmbed({
                    url: url
                })
                setUrl('')
                break
            default:
                console.error('Unknown embed type:', embedType)
        }
    }

    const setLink = () => {
        if (hyperLink !== '') {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: hyperLink }).run()

            setHyperLink('')
        }
    }

    const insertImageFromUrl = () => {
        setGalleryModalOpen(true)
    }
    return (
        <div className="bg-white font-sans border-2 border-[#dddddd] rounded-[6px] relative">
            <div className="flex flex-wrap gap-3 items-center bg-[#EFF0F1] p-[10px] sticky -top-4 z-10">
                {/* heading */}
                <Popover
                    className="flex items-center gap-3 font-sans font-semibold text-base text-textBlack"
                    placement="bottom"
                    color="#EFF0F1"
                    content={
                        <div className="flex flex-col">
                            {/* Paragraph option */}
                            <ToolbarButton
                                className="text-font18 font-semibold text-left"
                                onClick={() => editor.chain().focus().setParagraph().run()}
                                active={editor.isActive('paragraph')}>
                                Paragraph
                            </ToolbarButton>

                            {/* Headings */}
                            <ToolbarButton
                                className="font-bold text-xl text-left"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                active={editor.isActive('heading', { level: 2 })}>
                                Heading 2
                            </ToolbarButton>
                            <ToolbarButton
                                className="font-bold text-lg text-left"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                active={editor.isActive('heading', { level: 3 })}>
                                Heading 3
                            </ToolbarButton>
                            <ToolbarButton
                                className="font-bold text-lg text-left"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                                active={editor.isActive('heading', { level: 4 })}>
                                Heading 4
                            </ToolbarButton>
                            <ToolbarButton
                                className="font-bold text-base text-left"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                                active={editor.isActive('heading', { level: 5 })}>
                                Heading 5
                            </ToolbarButton>
                            <ToolbarButton
                                className="font-bold text-sm text-left"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                                active={editor.isActive('heading', { level: 6 })}>
                                Heading 6
                            </ToolbarButton>
                        </div>
                    }>
                    <span className="flex items-center">
                        Heading
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.59747 8.83763L5.1203 6.58553C5.08637 6.55468 5.05768 6.51851 5.03424 6.47701C5.01141 6.43606 5 6.39204 5 6.34492C5 6.2507 5.03393 6.16966 5.10179 6.10179C5.17088 6.03393 5.26157 6 5.37384 6H10.6271C10.7387 6 10.8288 6.03477 10.8973 6.10432C10.9658 6.17386 11 6.25463 11 6.34661C11 6.37016 10.9599 6.4498 10.8797 6.58553L8.40253 8.83763C8.34516 8.88979 8.28347 8.92989 8.21746 8.95794C8.15145 8.98598 8.07896 9 8 9C7.92104 9 7.84855 8.98598 7.78254 8.95794C7.71653 8.92989 7.65484 8.88979 7.59747 8.83763Z"
                                fill="black"
                            />
                        </svg>
                    </span>
                </Popover>
                <Select
                    defaultValue="16px"
                    style={{ width: 90, marginLeft: 8 }}
                    onChange={(value) => {
                        editor.chain().focus().setMark('textStyle', { fontSize: value }).run()
                    }}
                    options={[
                        { value: '12px', label: '12px' },
                        { value: '14px', label: '14px' },
                        { value: '16px', label: '16px' },
                        { value: '18px', label: '18px' },
                        { value: '20px', label: '20px' },
                        { value: '22px', label: '22px' },
                        { value: '24px', label: '24px' },
                        { value: '28px', label: '28px' },
                        { value: '30px', label: '30px' },
                        { value: '32px', label: '32px' }
                    ]}
                />
                {/* bold */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.4062 15.625H5.625V4.375H10.9375C11.5639 4.37504 12.1771 4.55435 12.7048 4.89174C13.2325 5.22914 13.6526 5.71052 13.9155 6.27903C14.1784 6.84754 14.2731 7.47942 14.1884 8.10001C14.1037 8.72061 13.8431 9.30399 13.4375 9.78125C13.9673 10.205 14.3528 10.7825 14.5408 11.4344C14.7289 12.0862 14.7102 12.7803 14.4875 13.4211C14.2647 14.0619 13.8488 14.6179 13.297 15.0126C12.7452 15.4073 12.0847 15.6213 11.4062 15.625ZM7.5 13.75H11.3937C11.5784 13.75 11.7613 13.7136 11.9319 13.643C12.1025 13.5723 12.2575 13.4687 12.3881 13.3381C12.5187 13.2075 12.6223 13.0525 12.693 12.8819C12.7636 12.7113 12.8 12.5284 12.8 12.3438C12.8 12.1591 12.7636 11.9762 12.693 11.8056C12.6223 11.635 12.5187 11.48 12.3881 11.3494C12.2575 11.2188 12.1025 11.1152 11.9319 11.0445C11.7613 10.9739 11.5784 10.9375 11.3937 10.9375H7.5V13.75ZM7.5 9.0625H10.9375C11.1222 9.0625 11.305 9.02613 11.4756 8.95546C11.6463 8.88478 11.8013 8.7812 11.9319 8.65062C12.0625 8.52004 12.166 8.36501 12.2367 8.1944C12.3074 8.02378 12.3438 7.84092 12.3438 7.65625C12.3438 7.47158 12.3074 7.28872 12.2367 7.1181C12.166 6.94749 12.0625 6.79246 11.9319 6.66188C11.8013 6.5313 11.6463 6.42772 11.4756 6.35704C11.305 6.28637 11.1222 6.25 10.9375 6.25H7.5V9.0625Z"
                            fill="#212529"
                        />
                    </svg>
                </ToolbarButton>
                {/* italics */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15.625 5.625V4.375H7.5V5.625H10.7125L7.98125 14.375H4.375V15.625H12.5V14.375H9.2875L12.0187 5.625H15.625Z"
                            fill="#212529"
                        />
                    </svg>
                </ToolbarButton>
                {/* underline */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2.5 16.25H17.5V17.5H2.5V16.25ZM10 14.375C8.83968 14.375 7.72688 13.9141 6.90641 13.0936C6.08594 12.2731 5.625 11.1603 5.625 10V3.125H6.875V10C6.875 10.8288 7.20424 11.6237 7.79029 12.2097C8.37634 12.7958 9.1712 13.125 10 13.125C10.8288 13.125 11.6237 12.7958 12.2097 12.2097C12.7958 11.6237 13.125 10.8288 13.125 10V3.125H14.375V10C14.375 11.1603 13.9141 12.2731 13.0936 13.0936C12.2731 13.9141 11.1603 14.375 10 14.375Z"
                            fill="#212529"
                        />
                    </svg>
                </ToolbarButton>
                {/* strike  */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.5 9.37489H11.2225C10.945 9.30027 10.6662 9.23047 10.3863 9.16552C8.63125 8.75052 7.63875 8.44677 7.63875 7.02614C7.6245 6.7809 7.66081 6.53535 7.74542 6.30473C7.83004 6.07411 7.96115 5.86335 8.13062 5.68552C8.6615 5.24896 9.32644 5.0084 10.0137 5.00427C11.7825 4.96052 12.5981 5.56052 13.265 6.47302L14.2744 5.73552C13.8019 5.05699 13.1578 4.51605 12.4078 4.16796C11.6578 3.81987 10.8288 3.67711 10.0056 3.75427C8.99439 3.76072 8.01887 4.12898 7.25563 4.79239C6.96634 5.08583 6.74024 5.43541 6.59125 5.81959C6.44227 6.20377 6.37356 6.61439 6.38937 7.02614C6.36197 7.4767 6.4466 7.92702 6.63572 8.33688C6.82483 8.74674 7.11254 9.10337 7.47312 9.37489H2.5V10.6249H11.0325C12.2619 10.9811 12.9969 11.4449 13.0156 12.7236C13.0359 12.9968 12.9985 13.2712 12.9056 13.5289C12.8128 13.7866 12.6667 14.0218 12.4769 14.2193C11.8155 14.7406 10.9938 15.0165 10.1519 14.9999C9.52345 14.9817 8.90738 14.8208 8.35029 14.5294C7.7932 14.2381 7.30966 13.8238 6.93625 13.318L5.97812 14.1205C6.46358 14.7675 7.08994 15.2954 7.80972 15.6643C8.52951 16.0333 9.32384 16.2335 10.1325 16.2499H10.195C11.3492 16.2632 12.4695 15.8595 13.35 15.113C13.6625 14.7979 13.9054 14.4208 14.0632 14.006C14.2209 13.5913 14.2898 13.148 14.2656 12.7049C14.289 11.9469 14.0332 11.2068 13.5469 10.6249H17.5V9.37489Z"
                            fill="#212529"
                        />
                    </svg>
                </ToolbarButton>
                {/* ul */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.375 7.5C5.41053 7.5 6.25 6.66053 6.25 5.625C6.25 4.58947 5.41053 3.75 4.375 3.75C3.33947 3.75 2.5 4.58947 2.5 5.625C2.5 6.66053 3.33947 7.5 4.375 7.5Z"
                            fill="#404040"
                        />
                        <path
                            d="M4.375 16.25C5.41053 16.25 6.25 15.4105 6.25 14.375C6.25 13.3395 5.41053 12.5 4.375 12.5C3.33947 12.5 2.5 13.3395 2.5 14.375C2.5 15.4105 3.33947 16.25 4.375 16.25Z"
                            fill="#404040"
                        />
                        <path
                            d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5Z"
                            fill="#404040"
                        />
                    </svg>
                </ToolbarButton>
                {/* ol */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5ZM5 7.5V2.5H3.75V3.125H2.5V4.375H3.75V7.5H2.5V8.75H6.25V7.5H5ZM6.25 17.5H2.5V15C2.5 14.6685 2.6317 14.3505 2.86612 14.1161C3.10054 13.8817 3.41848 13.75 3.75 13.75H5V12.5H2.5V11.25H5C5.33152 11.25 5.64946 11.3817 5.88388 11.6161C6.1183 11.8505 6.25 12.1685 6.25 12.5V13.75C6.25 14.0815 6.1183 14.3995 5.88388 14.6339C5.64946 14.8683 5.33152 15 5 15H3.75V16.25H6.25V17.5Z"
                            fill="#404040"
                        />
                    </svg>
                </ToolbarButton>
                {/* table */}
                <Popover
                    className="flex items-center gap-2 font-sans font-semibold text-base text-textBlack"
                    placement="bottom"
                    color="#EFF0F1"
                    content={
                        <div className="flex flex-col">
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 10H17M10 17V3"
                                        stroke="#404040"
                                        stroke-width="1.2"
                                        stroke-miterlimit="10"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Insert Table
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().addColumnBefore().run()}
                                disabled={!editor.can().addColumnBefore()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 10H17M10 17V3"
                                        stroke="#404040"
                                        stroke-width="1.2"
                                        stroke-miterlimit="10"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Add Column Before
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().addColumnAfter().run()}
                                disabled={!editor.can().addColumnAfter()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 10H17M10 17V3"
                                        stroke="#404040"
                                        stroke-width="1.2"
                                        stroke-miterlimit="10"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Add Column After
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().addRowBefore().run()}
                                disabled={!editor.can().addRowBefore()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 10H17M10 17V3"
                                        stroke="#404040"
                                        stroke-width="1.2"
                                        stroke-miterlimit="10"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Add Row Before
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().addRowAfter().run()}
                                disabled={!editor.can().addRowAfter()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3 10H17M10 17V3"
                                        stroke="#404040"
                                        stroke-width="1.2"
                                        stroke-miterlimit="10"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                Add Row After
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().deleteColumn().run()}
                                disabled={!editor.can().deleteColumn()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.00008 10.8332C4.53984 10.8332 4.16675 10.4601 4.16675 9.99984V9.99984C4.16675 9.5396 4.53984 9.1665 5.00008 9.1665H15.0001C15.4603 9.1665 15.8334 9.5396 15.8334 9.99984V9.99984C15.8334 10.4601 15.4603 10.8332 15.0001 10.8332H5.00008Z"
                                        fill="#404040"
                                    />
                                </svg>
                                Delete Column
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().deleteRow().run()}
                                disabled={!editor.can().deleteRow()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.00008 10.8332C4.53984 10.8332 4.16675 10.4601 4.16675 9.99984V9.99984C4.16675 9.5396 4.53984 9.1665 5.00008 9.1665H15.0001C15.4603 9.1665 15.8334 9.5396 15.8334 9.99984V9.99984C15.8334 10.4601 15.4603 10.8332 15.0001 10.8332H5.00008Z"
                                        fill="#404040"
                                    />
                                </svg>
                                Delete Row
                            </ToolbarButton>
                            <ToolbarButton
                                className="text-base font-medium font-sans text-left text-textBlack flex gap-2 py-2 px-3 leading-0 items-center"
                                onClick={() => editor.chain().focus().deleteTable().run()}
                                disabled={!editor.can().deleteTable()}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M5.00008 10.8332C4.53984 10.8332 4.16675 10.4601 4.16675 9.99984V9.99984C4.16675 9.5396 4.53984 9.1665 5.00008 9.1665H15.0001C15.4603 9.1665 15.8334 9.5396 15.8334 9.99984V9.99984C15.8334 10.4601 15.4603 10.8332 15.0001 10.8332H5.00008Z"
                                        fill="#404040"
                                    />
                                </svg>
                                Delete Table
                            </ToolbarButton>
                        </div>
                    }>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.01076 20H19.9892C21.0982 20 22 19.2027 22 18.2222V5.77778C22 4.79733 21.0982 4 19.9892 4H4.01076C2.90182 4 2 4.79733 2 5.77778V18.2222C2 19.2027 2.90182 20 4.01076 20ZM4.01076 18.2222V13.7778H8.03227V18.2222H4.01076ZM14.0645 7.55556V12H10.043V7.55556H14.0645ZM8.03227 7.55556V12H4.01076V7.55556H8.03227ZM10.043 18.2222V13.7778H14.0645V18.2222H10.043ZM16.0753 18.2222V13.7778H19.9902V18.2222H16.0753ZM19.9892 12H16.0753V7.55556H19.9892V12Z"
                            fill="#404040"
                        />
                    </svg>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.59747 8.83763L5.1203 6.58553C5.08637 6.55468 5.05768 6.51851 5.03424 6.47701C5.01141 6.43606 5 6.39204 5 6.34492C5 6.2507 5.03393 6.16966 5.10179 6.10179C5.17088 6.03393 5.26157 6 5.37384 6H10.6271C10.7387 6 10.8288 6.03477 10.8973 6.10432C10.9658 6.17386 11 6.25463 11 6.34661C11 6.37016 10.9599 6.4498 10.8797 6.58553L8.40253 8.83763C8.34516 8.88979 8.28347 8.92989 8.21746 8.95794C8.15145 8.98598 8.07896 9 8 9C7.92104 9 7.84855 8.98598 7.78254 8.95794C7.71653 8.92989 7.65484 8.88979 7.59747 8.83763Z"
                            fill="black"
                        />
                    </svg>
                </Popover>
                {/* embed */}
                <Popover
                    className="flex items-center gap-0 font-sans font-semibold text-base text-textBlack"
                    placement="bottom"
                    color="#EFF0F1"
                    content={
                        <div className="flex flex-col gap-2">
                            {/* Embed Type Selector */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleTypeChange('youtube')}
                                    className={`px-2 py-1 text-[13px] font-medium flex items-center gap-1 leading-6 font-sans rounded-[4px] ${
                                        embedType === 'youtube' ? 'bg-[#D9d9d9]' : 'bg-[#EFF0F1]'
                                    }`}>
                                    <svg
                                        width="17"
                                        height="12"
                                        viewBox="0 0 17 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13.4692 0.000859107H3.53084C1.58015 0.000859107 0 1.57732 0 3.52234V8.47766C0 10.4227 1.581 12 3.53084 12H13.4692C15.4199 12 17 10.4227 17 8.47766V3.52234C17 1.57732 15.419 0 13.4692 0V0.000859107ZM11.0815 6.24055L6.43303 8.45275C6.40466 8.46628 6.37337 8.4724 6.34204 8.47056C6.3107 8.46872 6.28033 8.45897 6.25371 8.44221C6.22709 8.42545 6.20506 8.40221 6.18966 8.37463C6.17426 8.34705 6.16597 8.31601 6.16556 8.28436V3.72337C6.16612 3.69147 6.17469 3.66024 6.19045 3.63258C6.20621 3.60492 6.22866 3.58174 6.2557 3.56519C6.28274 3.54864 6.31349 3.53926 6.34509 3.53792C6.3767 3.53659 6.40812 3.54334 6.43644 3.55756L11.0857 5.90722C11.1167 5.92279 11.1427 5.94686 11.1607 5.97665C11.1787 6.00645 11.188 6.04076 11.1876 6.07566C11.1871 6.11056 11.177 6.14462 11.1582 6.17394C11.1394 6.20326 11.1128 6.22578 11.0815 6.24055Z"
                                            fill="#404040"
                                        />
                                    </svg>
                                    YouTube
                                </button>
                                <button
                                    onClick={() => handleTypeChange('twitter')}
                                    className={`px-2 py-1 text-[13px] font-medium flex items-center gap-1 leading-6 font-sans rounded-[4px] ${
                                        embedType === 'twitter' ? 'bg-[#D9d9d9]' : 'bg-[#EFF0F1]'
                                    }`}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_748_6233)">
                                            <path
                                                opacity="0.994"
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.04297 -0.0117188C4.33985 -0.0117188 7.63671 -0.0117188 10.9336 -0.0117188C11.4961 0.128906 11.8477 0.480469 11.9883 1.04297C11.9883 4.33985 11.9883 7.63671 11.9883 10.9336C11.8477 11.4961 11.4961 11.8477 10.9336 11.9883C7.63671 11.9883 4.33985 11.9883 1.04297 11.9883C0.480469 11.8477 0.128906 11.4961 -0.0117188 10.9336C-0.0117188 7.63671 -0.0117188 4.33985 -0.0117188 1.04297C0.128906 0.480469 0.480469 0.128906 1.04297 -0.0117188ZM1.93359 1.83984C2.72651 1.81256 3.52338 1.80865 4.32422 1.82812C5.00135 2.79434 5.66932 3.76699 6.32812 4.74609C6.36586 4.79838 6.40882 4.84526 6.45703 4.88672C7.33202 3.8711 8.20704 2.85546 9.08203 1.83984C9.3086 1.80859 9.53515 1.80859 9.76172 1.83984C8.75702 3.00464 7.75702 4.1726 6.76172 5.34375C7.84139 6.95081 8.93512 8.54848 10.043 10.1367C9.24621 10.1641 8.44934 10.168 7.65234 10.1484C6.90335 9.06844 6.15727 7.98642 5.41406 6.90234C4.47216 7.97782 3.53857 9.05984 2.61328 10.1484C2.38671 10.1641 2.16016 10.1641 1.93359 10.1484C2.99738 8.92069 4.05206 7.6863 5.09766 6.44531C4.04653 4.90622 2.99184 3.37106 1.93359 1.83984Z"
                                                fill="#404040"
                                            />
                                            <path
                                                opacity="0.962"
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M2.87109 2.33203C3.24616 2.32813 3.62116 2.33203 3.99609 2.34375C5.70211 4.7753 7.40522 7.20888 9.10547 9.64453C8.7307 9.67186 8.3557 9.67577 7.98047 9.65625C7.96095 9.63673 7.9414 9.61718 7.92188 9.59766C6.23252 7.17818 4.54894 4.75629 2.87109 2.33203Z"
                                                fill="#404040"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_748_6233">
                                                <rect
                                                    width="12"
                                                    height="12"
                                                    fill="white"
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Twitter
                                </button>
                                <button
                                    onClick={() => handleTypeChange('instagram')}
                                    className={`px-2 py-1 text-[13px] font-medium flex items-center gap-1 leading-6 font-sans rounded-[4px] ${
                                        embedType === 'instagram' ? 'bg-[#D9d9d9]' : 'bg-[#EFF0F1]'
                                    }`}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            opacity="0.989"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M2.77458 0.00484555C5.00795 -0.00843319 7.24067 0.00557984 9.4728 0.0468846C10.5785 0.256021 11.3492 0.877263 11.785 1.91062C11.8932 2.19048 11.9586 2.48008 11.9811 2.77942C11.9998 4.9281 11.9998 7.07674 11.9811 9.22541C11.8082 10.5939 11.0656 11.4861 9.75306 11.9019C9.57785 11.9444 9.40033 11.9724 9.22057 11.986C7.0719 12.0047 4.92325 12.0047 2.77458 11.986C1.40597 11.813 0.513802 11.0703 0.0980919 9.75791C0.0555707 9.58269 0.0275447 9.40517 0.0140137 9.22541C-0.00467124 7.07674 -0.00467124 4.9281 0.0140137 2.77942C0.247776 1.16772 1.16797 0.24286 2.77458 0.00484555ZM9.13649 2.19088C9.66075 2.26184 9.85225 2.55143 9.71103 3.05968C9.4744 3.39434 9.18013 3.45505 8.82821 3.24185C8.51098 2.87553 8.54834 2.54855 8.94031 2.26094C9.01049 2.24138 9.07587 2.21803 9.13649 2.19088ZM5.66126 3.03166C6.91226 2.9635 7.87916 3.44927 8.56196 4.48901C9.18262 5.69012 9.08921 6.82983 8.2817 7.90819C7.42152 8.85317 6.37055 9.16614 5.12877 8.84706C3.9332 8.42687 3.23721 7.59077 3.04083 6.33873C2.9711 4.85674 3.61104 3.8151 4.96061 3.21383C5.19429 3.13908 5.42786 3.07838 5.66126 3.03166Z"
                                            fill="#404040"
                                        />
                                        <path
                                            opacity="0.983"
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M5.66061 4.20885C6.44727 4.11407 7.06852 4.385 7.52434 5.02161C7.81295 5.53824 7.869 6.08007 7.69249 6.64712C7.29932 7.50023 6.63134 7.87858 5.68863 7.78218C4.89317 7.61265 4.40271 7.13152 4.21726 6.33883C4.12142 5.23066 4.60254 4.52067 5.66061 4.20885Z"
                                            fill="#404040"
                                        />
                                    </svg>
                                    Instagram
                                </button>
                            </div>

                            {/* URL Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={url}
                                    onChange={handleUrlChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex justify-end items-center">
                                {/* Upload Button */}
                                <button
                                    onClick={handleEmbed}
                                    className="bg-secondary w-fit text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                                    Upload
                                </button>
                            </div>
                        </div>
                    }>
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            opacity="0.966"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.6211 4.62109C10.8555 4.61198 17.0898 4.62109 23.3242 4.64844C24.632 4.91717 25.4067 5.71014 25.6484 7.02734C25.6849 11.6576 25.6849 16.2877 25.6484 20.918C25.4067 22.2352 24.632 23.0281 23.3242 23.2969C17.0898 23.3334 10.8555 23.3334 4.6211 23.2969C3.31334 23.0281 2.5386 22.2352 2.29688 20.918C2.26042 16.2877 2.26042 11.6576 2.29688 7.02734C2.54854 5.70943 3.32328 4.90733 4.6211 4.62109ZM4.83985 5.82422C10.9284 5.81509 17.0169 5.82422 23.1055 5.85156C23.9441 6.03395 24.3907 6.55348 24.4453 7.41016C24.4727 7.84727 24.4817 8.28477 24.4727 8.72266C17.4727 8.72266 10.4727 8.72266 3.47266 8.72266C3.44403 8.07789 3.48961 7.43985 3.60938 6.80859C3.86339 6.27703 4.27355 5.94891 4.83985 5.82422ZM3.47266 9.92578C10.4727 9.92578 17.4727 9.92578 24.4727 9.92578C24.4818 13.4623 24.4727 16.9987 24.4453 20.5352C24.3907 21.3918 23.9441 21.9114 23.1055 22.0937C17.0169 22.1302 10.9284 22.1302 4.83985 22.0937C4.00123 21.9114 3.55461 21.3918 3.5 20.5352C3.47266 16.9987 3.46354 13.4623 3.47266 9.92578Z"
                            fill="black"
                        />
                        <path
                            opacity="0.937"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.7851 12.7695C12.5106 12.6899 12.7749 12.9999 12.5781 13.6992C11.7122 14.5651 10.8463 15.431 9.98046 16.2969C10.8463 17.1627 11.7122 18.0286 12.5781 18.8945C12.7933 19.4305 12.6201 19.7586 12.0586 19.8789C11.925 19.8496 11.7974 19.804 11.6758 19.7422C10.664 18.7305 9.65233 17.7187 8.64061 16.707C8.45834 16.4336 8.45834 16.1601 8.64061 15.8867C9.68306 14.8351 10.7312 13.7961 11.7851 12.7695Z"
                            fill="black"
                        />
                        <path
                            opacity="0.937"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M15.6133 12.7697C15.87 12.7367 16.107 12.7822 16.3242 12.9064C17.3177 13.8999 18.3112 14.8934 19.3047 15.8869C19.487 16.1603 19.487 16.4338 19.3047 16.7072C18.293 17.7189 17.2813 18.7306 16.2695 19.7423C15.9337 19.9388 15.6329 19.8932 15.3672 19.6056C15.2578 19.3687 15.2578 19.1317 15.3672 18.8947C16.2331 18.0288 17.099 17.1629 17.9648 16.297C17.099 15.4312 16.2331 14.5652 15.3672 13.6994C15.2067 13.3194 15.2888 13.0095 15.6133 12.7697Z"
                            fill="black"
                        />
                    </svg>

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.59747 8.83763L5.1203 6.58553C5.08637 6.55468 5.05768 6.51851 5.03424 6.47701C5.01141 6.43606 5 6.39204 5 6.34492C5 6.2507 5.03393 6.16966 5.10179 6.10179C5.17088 6.03393 5.26157 6 5.37384 6H10.6271C10.7387 6 10.8288 6.03477 10.8973 6.10432C10.9658 6.17386 11 6.25463 11 6.34661C11 6.37016 10.9599 6.4498 10.8797 6.58553L8.40253 8.83763C8.34516 8.88979 8.28347 8.92989 8.21746 8.95794C8.15145 8.98598 8.07896 9 8 9C7.92104 9 7.84855 8.98598 7.78254 8.95794C7.71653 8.92989 7.65484 8.88979 7.59747 8.83763Z"
                            fill="black"
                        />
                    </svg>
                </Popover>

                {/* upload */}
                <ToolbarButton onClick={insertImageFromUrl}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4.42321 17.0832C4.00223 17.0832 3.64591 16.9373 3.35425 16.6457C3.06258 16.354 2.91675 15.9977 2.91675 15.5767V4.42296C2.91675 4.00199 3.06258 3.64567 3.35425 3.354C3.64591 3.06234 4.00223 2.9165 4.42321 2.9165H15.577C15.9979 2.9165 16.3542 3.06234 16.6459 3.354C16.9376 3.64567 17.0834 4.00199 17.0834 4.42296V15.5767C17.0834 15.9977 16.9376 16.354 16.6459 16.6457C16.3542 16.9373 15.9979 17.0832 15.577 17.0832H4.42321ZM5.62508 13.9582H14.439L11.6988 10.3044L9.35904 13.3492L7.69237 11.2178L5.62508 13.9582Z"
                            fill="#3C3C3C"
                        />
                    </svg>
                </ToolbarButton>

                {/* hyper link */}
                <Popover
                    className="flex items-center gap-0 font-sans font-semibold text-base text-textBlack"
                    placement="bottom"
                    color="#EFF0F1"
                    content={
                        <div className="flex flex-col gap-2">
                            {/* URL Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter link"
                                    value={hyperLink}
                                    onChange={handleHyperLinkChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="flex justify-end items-center">
                                {/* Upload Button */}
                                <button
                                    onClick={setLink}
                                    className="bg-secondary w-fit text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                                    Add
                                </button>
                            </div>
                        </div>
                    }>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.05421 9.41089C7.99838 8.46672 9.64505 8.46672 10.5892 9.41089L11.1784 10.0001L12.3567 8.82172L11.7675 8.23255C10.9817 7.44589 9.93505 7.01172 8.82171 7.01172C7.70838 7.01172 6.66171 7.44589 5.87588 8.23255L4.10755 10.0001C3.3282 10.7825 2.89063 11.8419 2.89062 12.9463C2.89062 14.0507 3.3282 15.1101 4.10755 15.8926C4.49402 16.2798 4.95325 16.5868 5.45881 16.7959C5.96437 17.0049 6.50629 17.112 7.05338 17.1109C7.60061 17.1121 8.14268 17.0051 8.64839 16.796C9.1541 16.5869 9.61347 16.2799 10 15.8926L10.5892 15.3034L9.41088 14.1251L8.82171 14.7142C8.3521 15.1817 7.71644 15.4442 7.0538 15.4442C6.39115 15.4442 5.75549 15.1817 5.28588 14.7142C4.81796 14.2448 4.55522 13.6091 4.55522 12.9463C4.55522 12.2835 4.81796 11.6478 5.28588 11.1784L7.05421 9.41089Z"
                            fill="#404040"
                        />
                        <path
                            d="M10.0002 4.10745L9.41105 4.69662L10.5894 5.87495L11.1786 5.28579C11.6482 4.81828 12.2838 4.55581 12.9465 4.55581C13.6091 4.55581 14.2448 4.81828 14.7144 5.28579C15.1823 5.75518 15.4451 6.39093 15.4451 7.0537C15.4451 7.71648 15.1823 8.35223 14.7144 8.82162L12.9461 10.5891C12.0019 11.5333 10.3552 11.5333 9.41105 10.5891L8.82189 9.99995L7.64355 11.1783L8.23272 11.7675C9.01855 12.5541 10.0652 12.9883 11.1786 12.9883C12.2919 12.9883 13.3386 12.5541 14.1244 11.7675L15.8927 9.99995C16.6721 9.21748 17.1096 8.15808 17.1096 7.0537C17.1096 5.94932 16.6721 4.88993 15.8927 4.10745C15.1107 3.32729 14.0511 2.88916 12.9465 2.88916C11.8418 2.88916 10.7823 3.32729 10.0002 4.10745Z"
                            fill="#404040"
                        />
                    </svg>

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.59747 8.83763L5.1203 6.58553C5.08637 6.55468 5.05768 6.51851 5.03424 6.47701C5.01141 6.43606 5 6.39204 5 6.34492C5 6.2507 5.03393 6.16966 5.10179 6.10179C5.17088 6.03393 5.26157 6 5.37384 6H10.6271C10.7387 6 10.8288 6.03477 10.8973 6.10432C10.9658 6.17386 11 6.25463 11 6.34661C11 6.37016 10.9599 6.4498 10.8797 6.58553L8.40253 8.83763C8.34516 8.88979 8.28347 8.92989 8.21746 8.95794C8.15145 8.98598 8.07896 9 8 9C7.92104 9 7.84855 8.98598 7.78254 8.95794C7.71653 8.92989 7.65484 8.88979 7.59747 8.83763Z"
                            fill="black"
                        />
                    </svg>
                </Popover>
            </div>

            <EditorContent
                editor={editor}
                className="min-h-[200px] p-4 bg-white text-base leading-relaxed focus:outline-none  tiptap-content"
            />

            {/* Global styles for the Tiptap editor content */}
            <style>{`
        /* Apply Inter font globally for consistency, if not already done */
        body {
          font-family: 'Inter', sans-serif;
        }

        /* Basic Tiptap editor content styling */
        .tiptap-content {
          min-height: 200px;
          border: 1px solid #EFF0F1; /* border-gray-200 */
          padding: 1rem; /* p-4 */
          background-color: #ffffff; /* bg-white */
          font-size: 1rem; /* text-base */
          line-height: 1.625; /* leading-relaxed */
          outline: none;
        }
        .tiptap-content a{
          color: #112D93;
          text-decoration:underline
        }
        .tiptap-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          background-color: white;
        }

        .tiptap-content th,
        .tiptap-content td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          vertical-align: top;
        }

        .tiptap-content th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .tiptap-content:focus-within {
          box-shadow: none; 
          border-color: none;
        }

        .ProseMirror:focus-visible{
        outline:none !important;
        }

        .tiptap-content > * + * {
          margin-top: 0.75em;
        }

        .tiptap-content ul,
        .tiptap-content ol {
          padding: 0 1rem;
          margin: 1.25rem 1rem 1.25rem 0.4rem;
        }

        .tiptap-content ul {
          list-style-type: disc;
        }

        .tiptap-content ol {
          list-style-type: decimal;
        }

        .tiptap-content li {
          margin-bottom: 0.25em;
        }


        .tiptap-content strong {
          font-weight: bold;
        }

        .tiptap-content em {
          font-style: italic;
        }

        .tiptap-content u {
          text-decoration: underline;
        }

        .tiptap-content img {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 0.5rem; /* rounded-lg */
          display: block; /* Prevents extra space below image */
         
        }

        .tiptap-content iframe {
          width: 100%;
          height: 360px; /* Default height for YouTube */
          border-radius: 0.5rem; /* rounded-lg */
          border: none;
        }
        .tiptap-content iframe {
          width: 100%;
          height: 360px;
          border-radius: 0.5rem;
          border: none;
        }
        /* Styles for custom embed wrappers */
        .x-embed-wrapper,
        .instagram-embed-wrapper {
          /* These styles are applied by the NodeViewWrapper directly */
          /* They provide a visual cue in the editor that this is an embed */
        }

.instagram-embed-wrapper {
    display: block;
    width: 100%;
}

.instagram-embed-wrapper>div {
    max-width: 6
        .x-embed-wrapper > div,
        .instagram-embed-wrapper > div {
          /* Target the inner div containing the actual embed component */
          max-width: 550px; /* Common max-width for embeds */
        }

        /* Tailwind CSS integration (ensure Tailwind is loaded in your project) */
        /* You might need @tailwindcss/typography plugin for better default content styles */
      `}</style>
            {galleryModalOpen && (
                <GetImgUrlModal
                    open={galleryModalOpen}
                    setOpen={setGalleryModalOpen}
                    modalType={EMediaType.IMAGE}
                    setImage={(url: string) => {
                        editor.chain().focus().setImage({ src: url }).run()
                    }}
                />
            )}
        </div>
    )
}
interface ToolbarButtonProps {
    children: React.ReactNode
    onClick: () => void
    active?: boolean
    disabled?: boolean
    className?: string
}
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ children, onClick, active, disabled, className }) => {
    return (
        <button
            onClick={onClick}
            type="button"
            disabled={disabled}
            className={`p-1 ${className} ${
                active ? 'bg-[#d9d9d9]' : 'bg-[#EFF0F1] hover:bg-gray-300 text-textBlack leading-0'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {children}
        </button>
    )
}
