import React, { Suspense } from 'react'
import styles from './lazyLoad.module.less'

export function Loading() {
  return (
    <div className={styles.loading}>
      <div className='page-loading-warp'>
        <div className='ant-spin ant-spin-lg ant-spin-spinning'>
          <span className='ant-spin-dot ant-spin-dot-spin'>
            <i className='ant-spin-dot-item'></i>
            <i className='ant-spin-dot-item'></i>
            <i className='ant-spin-dot-item'></i>
            <i className='ant-spin-dot-item'></i>
          </span>
        </div>
      </div>
      <div className='loading-title'>正在加载资源</div>
      <div className='loading-sub-title'>
        初次加载资源可能需要较多时间 请耐心等待
      </div>
    </div>
  )
}
/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
function LazyComponent(
  moduleName: string | React.LazyExoticComponent<any>
): any {
  const ModuleNameComponent = moduleName
  return function (props?: any) {
    return (
      <Suspense fallback={<Loading />}>
        <ModuleNameComponent {...props} />
      </Suspense>
    )
  }
}

export default LazyComponent
