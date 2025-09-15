import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { EConfigButtonType } from '../types/state.types'
import { ButtonThemeConfig } from './antdesign/configs.components'

const PageNotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="font-sans h-screen flex justify-center items-center">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <ButtonThemeConfig buttonType={EConfigButtonType.PRIMARY}>
                        <Button
                            onClick={() => navigate('/dashboard/overview')}
                            type="primary">
                            Back
                        </Button>
                    </ButtonThemeConfig>
                }
            />
        </div>
    )
}

export default PageNotFound
