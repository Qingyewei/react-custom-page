import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

//vite-plugin-svg-icons插件显示本地svg图标
import 'virtual:svg-icons-register'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />,
)
