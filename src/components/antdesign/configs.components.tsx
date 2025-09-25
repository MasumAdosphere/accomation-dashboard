/* eslint-disable react/prop-types */
import { ReactNode } from 'react'
import { ConfigProvider } from 'antd'
import { EConfigButtonType } from '../../types/state.types'

export const ButtonThemeConfig = ({ buttonType, children }: { buttonType: EConfigButtonType; children: ReactNode }) => {
    // Define different button themes based on the buttonType
    let buttonTheme = {}
    switch (buttonType) {
        case 'primary':
            buttonTheme = {
                defaultHoverBg: '#4226C4',
                defaultActiveBg: '#4226C4',
                defaultHoverColor: '#FFFFFF',
                defaultActiveColor: '#FFFFFF',
                defaultHoverBorderColor: '#4226C4'
                // defaultActiveBorderColor: "#20273C",
            }
            break
        case 'secondary':
            buttonTheme = {
                defaultHoverBg: '#14f478',
                defaultActiveColor: '#FFFFFF',
                defaultActiveBg: '#14f478',
                defaultHoverColor: '#FFFFFF'
            }
            break

        case 'transparent':
            buttonTheme = {
                defaultHoverBg: 'rgba(0, 0, 0, 0.0)'
            }
            break

        // Add more cases for other button types if needed
        default:
            break
    }

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: buttonTheme
                }
            }}>
            {children}
        </ConfigProvider>
    )
}
