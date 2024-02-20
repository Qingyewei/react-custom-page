import React, { Suspense } from 'react'

import { withErrorBoundary } from './index'
import LazyComponent from './LazyComponent'

export default (props: React.LazyExoticComponent<any>): any => {
  return withErrorBoundary(LazyComponent(props), {
    onError: (error: any, { componentStack }: any) => {
      window.console.error(error)
      window.console.log(componentStack)
    },
  })
}
