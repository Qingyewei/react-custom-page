import React from 'react'
import { useRoutes } from 'react-router-dom'
import Routes from './routes'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
export default function App() {
  const element = useRoutes(Routes)
  // return element;
  return <ConfigProvider locale={zhCN}>{element}</ConfigProvider>
}
