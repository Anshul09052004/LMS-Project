import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {store} from './Redux/store'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </provider>
)
