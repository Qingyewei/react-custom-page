import { RouteObject } from "react-router-dom";
import React from "react";
import lazyLoad from "./components/error_boundary/lazyLoad";
const PreviewMode = lazyLoad(React.lazy(() => import('@@/core/antd/PreviewMode')))
const AntdDesignForm = lazyLoad(React.lazy(() => import('@@/core/antd/AntdDesignForm')))
const Routes: RouteObject[] = [
  {
    path: "/react-custom-page/",
    element: <AntdDesignForm />,
  },
  {
    path: "/react-custom-page/preview-model",
    element: <PreviewMode />,
  },
];

export default Routes;
