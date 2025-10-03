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
                defaultHoverBg: '#0E082B',
                defaultActiveBg: '#4226C4',
                defaultHoverColor: '#FFFFFF',
                defaultActiveColor: '#FFFFFF',
                defaultHoverBorderColor: '#0E082B'
                // defaultActiveBorderColor: "#20273C",
            }
            break
        case 'secondary':
            buttonTheme = {
                defaultHoverBg: '#ffebfb',
                defaultActiveColor: '#4226c4',
                defaultActiveBg: '#ffebfb',
                defaultHoverColor: '#4226c4',
                defaultHoverBorderColor: '#4226C4',
                defaultActiveBorderColor: '#4226C4'
            }
            break
        case 'third':
            buttonTheme = {
                defaultHoverBg: '#0E082B',
                defaultActiveBg: '#0E082B',
                defaultHoverColor: '#FFFFFF',
                defaultActiveColor: '#FFFFFF',
                defaultHoverBorderColor: '#0E082B'
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
