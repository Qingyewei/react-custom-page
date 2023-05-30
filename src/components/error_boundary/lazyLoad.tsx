import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { withErrorBoundary } from './index';

/**
 * @description 路由懒加载
 * @param {Element} Comp 需要访问的组件
 * @returns element
 */
function LazyLoad(moduleName: string | React.LazyExoticComponent<any>): any {
  const LazyComponent = moduleName;
  console.log("LazyComponent",LazyComponent)
  return function (props?:any) {
    return (
      <Suspense
        fallback={(
          <Spin
            size="large"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          />
        )}
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

export default (props:React.LazyExoticComponent<any>):any =>{
  return withErrorBoundary(LazyLoad(props), {
    onError: (error: any, { componentStack }: any) => {
      window.console.error(error);
      window.console.log(componentStack);
    },
  })
  // return LazyLoad(props)()
};
