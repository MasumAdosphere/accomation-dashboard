import Api from '../httpAPI'
import execError from '../execError'

export const getInsights = async (signal: AbortSignal) => {
    try {
        const response = await Api.Insights.getInsights(signal)
        return response
    } catch (error) {
        return execError(error)
    }
}
