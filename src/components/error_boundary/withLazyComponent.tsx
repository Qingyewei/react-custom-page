import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from './index';

export default function withLazyComponent(importComponent: any): (props?: any) => React.ReactNode {
  const LazyComponent = lazy(importComponent);
  const errorBoundaryProps = {
    onError: (error: any, { componentStack }: any) => {
      window.console.error(error);
      window.console.log(componentStack);
    },
  };

  return function (props?: any) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
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
      </ErrorBoundary>
    );
  };
}
