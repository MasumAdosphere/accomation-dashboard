import ReactDOM from 'react-dom/client'
import router from './router'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './index.css'
import { RouterProvider } from 'react-router-dom'

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)
