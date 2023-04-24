import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/configureStore'
import AppRouter from './routers/AppRouter'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
   <Provider store={store}>
    <AppRouter />
  </Provider>
  </React.StrictMode>,
)
