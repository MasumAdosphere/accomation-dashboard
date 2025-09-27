import { Button, Modal, Pagination, Spin } from 'antd'
import { Dispatch, useEffect, useState } from 'react'
import {} from '../../types/selector.types'
import SearchIcon from '../../assets/search.svg'
import { ImageUpload } from '../antdesign/form.components'
import { EConfigButtonType, EMediaType, IGallery } from '../../types/state.types'
import moment from 'moment'
import { ButtonThemeConfig } from '../antdesign/configs.components'
import { fetchGallery } from '../../redux/gallery/gallery.thunk'

const GetImgUrlModal = ({
    open,
    setOpen,
    modalType,
    setImage
}: {
    open: boolean
    setOpen: Dispatch<boolean>
    modalType: EMediaType
    setImage: Dispatch<string>
}) => {
    // states
    const [files, setFiles] = useState<Array<IGallery>>([])
    const [fileName, setFileName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState<number | null>(null)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    // fetches all images
    const getImages = async (signal: AbortSignal) => {
        try {
            setIsLoading(true)
            const data = await fetchGallery(64, currentPage, fileName.length > 2 ? fileName : null, EMediaType.IMAGE, signal)
            if (data) {
                setFiles(data.medias)
                setTotalPages(data?.totalPages)
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // handles select image button
    const selectImageHandler = (_event: any, value: any) => {
        setImage(value.currentUrl)
        setOpen(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setCurrentPage(1)
        setFileName(value.trim())
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (modalType === EMediaType.IMAGE) {
            getImages(signal)
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, fileName])
    return (
        <Modal
            centered
            cancelButtonProps={{ style: { display: 'none' } }}
            footer={null}
            className="relative"
            open={open}
            onCancel={() => setOpen(false)}
            width={1400}>
            <div
                className="font-sans w-full overflow-auto max-h-[350px]  2xl:max-h-[750px] relative pb-4"
                onClick={() => setCurrentSelectedIndex(null)} // Clear selection when clicking outside
            >
                <div className="font-sans mb-4 relative">
                    <div className="bg-white">
                        <h1 className="font-sans font-bold text-lg 2xl:text-xl capitalize ">Image Library</h1>
                        <div className="flex items-center gap-6 w-full py-2 2xl:py-4 z-10 bg-white">
                            <div className="bg-[#E3E3E36B] border border-[#E3E3E36B] hover:border-[#d2d2d2] text-lg rounded-[40px] flex items-center gap-[10px] w-full md:w-2/3">
                                <div className="flex items-center gap-[10px] border-r border-[#5E5E5E] px-6">
                                    <img
                                        src={SearchIcon}
                                        alt=""
                                    />
                                    <span className="font-sans font-semibold text-base 2xl:text-lg text-[#5E5E5E]">Search</span>
                                </div>
                                <input
                                    id="searchText"
                                    type="text"
                                    className="bg-transparent w-full text-base 2xl:text-lg px-5 py-[10px] rounded-[40px] focus-within:outline-none"
                                    autoComplete="off"
                                    placeholder="search image/video files"
                                    value={fileName}
                                    onChange={handleChange}
                                />
                            </div>
                            <ImageUpload
                                setFiles={setFiles}
                                setTotalPages={setTotalPages}
                                setImage={setImage}
                                modalType={modalType}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-[50vh] w-full col-span-4">
                            <Spin />
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-4 relative  scroll-container">
                            <div className="col-span-3 font-sans w-full h-fit grid grid-cols-8 justify-start items-start">
                                {files &&
                                    files.map((value, index) =>
                                        value.mediaType === EMediaType.IMAGE ? (
                                            <div
                                                className="font-sans flex flex-col"
                                                key={index}
                                                style={{
                                                    borderRadius: '10px 10px 0 0',
                                                    overflow: 'hidden',
                                                    marginRight: '13px',
                                                    marginTop: '10px'
                                                }}>
                                                <img
                                                    src={value?.currentUrl}
                                                    key={index}
                                                    height={200}
                                                    className={`object-center object-cover rounded-lg aspect-square w-full ${
                                                        currentSelectedIndex === index ? 'border-blue-500 border-[5px]' : ''
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setCurrentSelectedIndex(index)
                                                    }}
                                                />
                                                {/* <Button
                              type="default"
                              onClick={(e) => {
                                selectImageHandler(e, value);
                              }}
                            >
                              Select
                            </Button> */}
                                            </div>
                                        ) : (
                                            <div
                                                className="font-sans flex flex-col"
                                                key={index}
                                                style={{
                                                    borderRadius: '10px 10px 0 0',
                                                    overflow: 'hidden',
                                                    marginRight: '13px',
                                                    marginTop: '10px'
                                                }}>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setCurrentSelectedIndex(index)
                                                    }}
                                                    className={`relative object-center object-cover aspect-square rounded-xl w-full cursor-pointer ${
                                                        currentSelectedIndex === index ? 'border-blue-500 border-[5px]' : ''
                                                    }`}>
                                                    <video
                                                        src={value?.currentUrl}
                                                        key={index}
                                                        className="w-full h-[190px] object-cover rounded-lg"
                                                    />
                                                    {/* Overlay icon to indicate it's a video */}
                                                    <div className="absolute h-[190px] inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-12 w-12 text-white"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* <Button
                              type="default"
                              onClick={(e) => {
                                selectVideoHandler(e, value);
                              }}
                            >
                              Select
                            </Button> */}
                                            </div>
                                        )
                                    )}
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="border rounded-lg border-[#ddd] p-4 mt-4 sticky top-0 flex flex-col gap-6 h-[550px] overflow-auto bg-white">
                                {currentSelectedIndex !== null ? (
                                    <>
                                        {files[currentSelectedIndex].mediaType === EMediaType.IMAGE ? (
                                            <img
                                                src={files[currentSelectedIndex]?.currentUrl}
                                                key={currentSelectedIndex}
                                                className={`max-h-[400px] rounded-lg w-auto object-contain object-center`}
                                            />
                                        ) : (
                                            <video
                                                src={files[currentSelectedIndex]?.currentUrl}
                                                key={currentSelectedIndex}
                                                controls
                                                className={`max-h-[400px] rounded-lg w-auto object-contain object-center`}
                                            />
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <span className="font-sans text-sm text-grayText font-medium">Name:</span>
                                            <span className="font-sans text-sm text-textBlack font-semibold">
                                                {files[currentSelectedIndex].fileName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-0">
                                            <div className="flex flex-col gap-1 w-full">
                                                <span className="font-sans text-sm text-grayText font-medium">Media type:</span>
                                                <span className="font-sans text-sm text-textBlack capitalize font-semibold">
                                                    {files[currentSelectedIndex].mediaType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-sans text-sm text-grayText font-medium">Uploaded At:</span>
                                            <span className="font-sans text-sm text-textBlack font-semibold">
                                                {files[currentSelectedIndex].createdAt
                                                    ? moment(files[currentSelectedIndex].createdAt).format('DD-MM-YYYY | hh:mm A')
                                                    : 'NA'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="font-sans h-[70vh] text-lg flex justify-center items-center text-grayText font-medium">
                                        No file selected
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <Pagination
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    total={totalPages * 10}
                    pageSize={10}
                    showSizeChanger={false}
                />
            </div>
            <div className="bg-white sticky bottom-0 w-full flex justify-end items-center gap-2">
                <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                    <Button
                        className="font-sans font-semibold text-sm 2xl:text-lg rounded-md 2xl:rounded-xl w-24 2xl:w-[137px] h-8 2xl:h-[52px] hover:text-white !hover:bg-darkblue bg-white text-darkblue border-darkblue"
                        type="default"
                        onClick={() => {
                            setOpen(false)
                        }}>
                        Cancel
                    </Button>
                </ButtonThemeConfig>
                <ButtonThemeConfig buttonType={EConfigButtonType.THIRD}>
                    <Button
                        className="font-sans font-semibold text-sm 2xl:text-lg rounded-md 2xl:rounded-xl w-28 2xl:w-[159px] h-8 2xl:h-[52px] flex items-center  justify-center bg-darkblue text-white "
                        type="default"
                        onClick={(e) => {
                            if (files[currentSelectedIndex as number].mediaType === EMediaType.IMAGE) {
                                selectImageHandler(e, files[currentSelectedIndex as number])
                            }
                            //   else if (
                            //     files[currentSelectedIndex as number].mediaType ===
                            //     EMediaType.VIDEO
                            //   ) {
                            //     selectVideoHandler(e, files[currentSelectedIndex as number]);
                            //   }
                        }}>
                        Select
                    </Button>
                </ButtonThemeConfig>
            </div>
        </Modal>
    )
}

export default GetImgUrlModal
