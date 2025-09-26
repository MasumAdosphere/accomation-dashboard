import { Dispatch, useState } from 'react'
import { TextItem } from './form.components'
import Exclaim from '../../assets/exclaim.svg'
import loadingSvg from '../../assets/loading.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../types/selector.types'
import { ButtonThemeConfig } from './configs.components'
import { EConfigButtonType } from '../../types/state.types'
import { deleteArticleById } from '../../redux/article/article.thunk'
import { setIsDataRefreshed } from '../../redux/common/common.slice'
import { createCategory, deleteCategoryById } from '../../redux/category/category.thunk'
import { Modal, Button, message, Form, Radio, RadioChangeEvent, ConfigProvider } from 'antd'
import { deleteTestimonialById } from '../../redux/testimonials/testimonial.thunk'
import { deleteFaqById } from '../../redux/faq/faq.thunk'
import { deleteLogoById } from '../../redux/logo/logo.thunk'
import { deleteCareer } from '../../redux/career/career.thunk'

//Category Modal
export const CreateNewCategoryModal = ({
    isNewCategoryModalOpen,
    setIsNewCategoryModalOpen
}: {
    isNewCategoryModalOpen: boolean
    setIsNewCategoryModalOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [dataValues, setDataValues] = useState({
        title: ''
    })
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const { title } = dataValues

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
        try {
            const data = await createCategory(dataValues)
            if (data.success) {
                setIsNewCategoryModalOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            //@ts-ignore
            message.error(error.message)
        }
    }
    const handleRadioChange = (e: RadioChangeEvent) => {
        setDataValues((prev) => ({ ...prev, feature: e.target.value }))
    }

    return (
        <div>
            <Modal
                title={<span className="font-sans text-lg">Add Category</span>}
                centered
                open={isNewCategoryModalOpen}
                width={560}
                cancelButtonProps={{ style: { display: 'none' } }}
                footer={null}
                onCancel={() => setIsNewCategoryModalOpen(false)}>
                <hr />
                <Form
                    form={form}
                    className="font-sans flex flex-col w-full space-y-3 mt-3"
                    onFinish={createCategoryHandler}
                    fields={[
                        {
                            name: 'title',
                            value: title
                        }
                    ]}>
                    <div className="font-sans space-y-1 md:space-y-1">
                        <label className="font-sans  text-font18 font-medium text-gray44">
                            Title
                            <span className="font-sans text-red-500 pl-1">*</span>
                        </label>
                        <TextItem
                            name="name"
                            type="text"
                            placeholder="Enter title"
                            required={true}
                            onChange={inputChangeHandler('title')}
                        />
                    </div>
                    {/* <div className="font-sans space-y-1 md:space-y-1">
                        <div className="">
                            <label className="font-sans  text-sm font-semibold text-primary">
                                Blog
                                <span className="font-sans text-red-500 pl-1">*</span>
                            </label>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Radio: {
                                            colorPrimary: '#083050'
                                        }
                                    }
                                }}>
                                <Radio.Group
                                    onChange={handleRadioChange}
                                    value={feature}
                                    className="space-y-2 w-full">
                                    <div className="grid grid-cols-12 gap-4">
                                        {['Blog', 'Testimonial'].map((item) => (
                                            <label
                                                key={item}
                                                className={`col-span-6 cursor-pointer rounded-[10px] hover:bg-grayBg py-2 border border-[#eee] ${
                                                    feature === item ? 'bg-grayBg border-primary' : ''
                                                }`}
                                                onClick={() =>
                                                    //@ts-ignore
                                                    handleRadioChange({ target: { value: item } })
                                                }>
                                                <div className="flex items-center gap-2 px-4">
                                                    <Radio value={item} />
                                                    <span className="text-base 2xl:text-lg font-semibold">{item}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </Radio.Group>
                            </ConfigProvider>
                        </div>
                    </div> */}

                    <div className="font-sans flex space-x-3 pt-[50px] justify-end items-center">
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                type="default"
                                onClick={() => setIsNewCategoryModalOpen(false)}
                                className="font-sans h-auto rounded-[100px] bg-white text-primary border-primary text-sm 2xl:text-base shadow-none flex justify-center items-center px-3 2xl:px-6 py-1 2xl:py-2">
                                Cancel
                            </Button>
                        </ButtonThemeConfig>
                        <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                            <Button
                                type="default"
                                htmlType="submit"
                                className="font-sans h-auto rounded-[100px] bg-primary text-white border-none text-sm 2xl:text-base shadow-none flex justify-center items-center px-3 2xl:px-6 py-1 2xl:py-2">
                                Add
                            </Button>
                        </ButtonThemeConfig>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}
export const DeleteCategoryModal = ({
    selectedCategoryId,
    isDeleteCategoryModalOpen,
    setIsDeleteCategoryModalOpen
}: {
    selectedCategoryId: string
    isDeleteCategoryModalOpen: boolean
    setIsDeleteCategoryModalOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const deleteContent = async () => {
        try {
            setLoading(true)
            setIsDisabled(true)
            const res = await deleteCategoryById(selectedCategoryId as string)

            if (res.success) {
                setIsDeleteCategoryModalOpen(false)
                setLoading(false)
                setIsDisabled(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch {
            setIsDeleteCategoryModalOpen(false)
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }
    return (
        <Modal
            open={isDeleteCategoryModalOpen}
            onCancel={() => setIsDeleteCategoryModalOpen(false)}
            footer={null}
            centered
            width={500}>
            <div className="flex items-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt=""
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Category?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="border rounded h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteCategoryModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={() => deleteContent()}
                    className={`font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-auto animate-spin"
                            alt=""
                        />
                    )}{' '}
                    Yes, Delete Category
                </button>
            </div>
        </Modal>
    )
}

//Article Modal
export const DeleteArticleModal = ({
    selectedArticleId,
    isDeleteArticleModalOpen,
    setIsDeleteArticleModalOpen
}: {
    selectedArticleId: string
    isDeleteArticleModalOpen: boolean
    setIsDeleteArticleModalOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)
    const deleteContent = async () => {
        try {
            setLoading(true)
            setIsDisabled(true)
            const res = await deleteArticleById(selectedArticleId as string)

            if (res.success) {
                setIsDeleteArticleModalOpen(false)
                setLoading(false)
                setIsDisabled(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch {
            setIsDeleteArticleModalOpen(false)
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }
    return (
        <Modal
            open={isDeleteArticleModalOpen}
            onCancel={() => setIsDeleteArticleModalOpen(false)}
            footer={null}
            centered
            width={500}>
            <div className="flex items-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt=""
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Article?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="border rounded h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteArticleModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={() => deleteContent()}
                    className={`font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-auto animate-spin"
                            alt=""
                        />
                    )}{' '}
                    Yes, Delete Article
                </button>
            </div>
        </Modal>
    )
}
export const DeleteTestimonialModal = ({
    selectedTestimonialId,
    isDeleteTestimonialModalOpen,
    setIsDeleteTestimonialModalOpen
}: {
    selectedTestimonialId: string
    isDeleteTestimonialModalOpen: boolean
    setIsDeleteTestimonialModalOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const deleteContent = async () => {
        try {
            setLoading(true)
            setIsDisabled(true)
            const res = await deleteTestimonialById(selectedTestimonialId as string)

            if (res.success) {
                setIsDeleteTestimonialModalOpen(false)
                setLoading(false)
                setIsDisabled(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch {
            setIsDeleteTestimonialModalOpen(false)
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }

    return (
        <Modal
            open={isDeleteTestimonialModalOpen}
            onCancel={() => setIsDeleteTestimonialModalOpen(false)}
            footer={null}
            centered
            width={500}>
            <div className="flex item-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt=""
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Testimonial?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="borderrounded h-autobg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteTestimonialModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={() => deleteContent()}
                    className={`font-sans h-autorounded bg-primary text-white border-primary text-lg shadow-none flexjustify-centeritem-center px-4 py-2 ${isDisabled ? 'opacity-40cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-autoanimate-spin"
                            alt=""
                        />
                    )}{' '}
                    Yes, Delete Testimonial
                </button>
            </div>
        </Modal>
    )
}

export const DeleteFaqModal = ({
    selectedFaqId,
    isDeleteFaqModalOpen,
    setIsDeleteFaqModalOpen
}: {
    selectedFaqId: string
    isDeleteFaqModalOpen: boolean
    setIsDeleteFaqModalOpen: Dispatch<boolean>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const deleteContent = async () => {
        console.log('id', selectedFaqId)
        try {
            setLoading(true)
            setIsDisabled(true)

            const res = await deleteFaqById(selectedFaqId as string)

            if (res.success) {
                setIsDeleteFaqModalOpen(false)
                setLoading(false)
                setIsDisabled(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch {
            setIsDeleteFaqModalOpen(false)
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }

    return (
        <Modal
            open={isDeleteFaqModalOpen}
            onCancel={() => setIsDeleteFaqModalOpen(false)}
            footer={null}
            centered
            width={500}>
            <div className="flex item-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt=""
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Faq?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="border rounded h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteFaqModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={() => deleteContent()}
                    className={`font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center item-center px-4 py-2 ${isDisabled ? 'opacity-40cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-auto animate-spin"
                            alt=""
                        />
                    )}{' '}
                    Yes, Delete Faq
                </button>
            </div>
        </Modal>
    )
}
export const DeleteLogoModal = ({
    selectedLogoId,
    isDeleteLogoModalOpen,
    setIsDeleteLogoModalOpen
}: {
    selectedLogoId: string | null
    isDeleteLogoModalOpen: boolean
    setIsDeleteLogoModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const deleteContent = async () => {
        if (!selectedLogoId) return

        try {
            setLoading(true)
            setIsDisabled(true)
            const res = await deleteLogoById(selectedLogoId)

            if (res.success) {
                setIsDeleteLogoModalOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error('Delete failed:', error)
            setIsDeleteLogoModalOpen(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }

    return (
        <Modal
            open={isDeleteLogoModalOpen}
            onCancel={() => setIsDeleteLogoModalOpen(false)}
            footer={null}
            centered
            width={500}
            className="rounded-xl">
            <div className="flex items-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt="Warning"
                    width={24}
                    height={24}
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Logo?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="border rounded h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteLogoModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={deleteContent}
                    className={`font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-auto animate-spin"
                            alt="Loading"
                        />
                    )}
                    Yes, Delete Logo
                </button>
            </div>
        </Modal>
    )
}

export const DeleteCareerModal = ({
    selectedCareerId,
    isDeleteCareerModalOpen,
    setIsDeleteCareerModalOpen
}: {
    selectedCareerId: string | null
    isDeleteCareerModalOpen: boolean
    setIsDeleteCareerModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const { isDataRefreshed } = useSelector((state: RootState) => state.Common)

    const deleteContent = async () => {
        if (!selectedCareerId) return

        try {
            setLoading(true)
            setIsDisabled(true)
            const res = await deleteCareer(selectedCareerId)

            if (res.success) {
                setIsDeleteCareerModalOpen(false)
                dispatch(setIsDataRefreshed(!isDataRefreshed))
            }
        } catch (error) {
            console.error('Delete failed:', error)
            setIsDeleteCareerModalOpen(false)
        } finally {
            setIsDisabled(false)
            setLoading(false)
        }
    }

    return (
        <Modal
            open={isDeleteCareerModalOpen}
            onCancel={() => setIsDeleteCareerModalOpen(false)}
            footer={null}
            centered
            width={500}
            className="rounded-xl">
            <div className="flex items-center mt-5 gap-[12px]">
                <img
                    src={Exclaim}
                    alt="Warning"
                    width={24}
                    height={24}
                />
                <h6 className="font-notoKannada font-normal text-[20px]">Are you sure you want to delete this Career Listing?</h6>
            </div>
            <div className="flex w-full justify-end mt-6 gap-[17px]">
                <button
                    className="border rounded h-auto bg-white text-primary border-primary text-base shadow-none px-4 py-2"
                    onClick={() => setIsDeleteCareerModalOpen(false)}>
                    No
                </button>

                <button
                    disabled={isDisabled}
                    onClick={deleteContent}
                    className={`font-sans h-auto rounded bg-primary text-white border-primary text-lg shadow-none flex justify-center items-center px-4 py-2 ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    {loading && (
                        <img
                            src={loadingSvg}
                            className="h-6 w-auto animate-spin"
                            alt="Loading"
                        />
                    )}
                    Yes, Delete Career
                </button>
            </div>
        </Modal>
    )
}
