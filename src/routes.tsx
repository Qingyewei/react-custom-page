import { RouteObject, useRoutes } from "react-router-dom";
import AntdDesignForm from "./components/DesignForm/core/antd/AntdDesignForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewMode from "./components/DesignForm/core/antd/PreviewMode";
import React from "react";
import lazyLoad from "./components/error_boundary/lazyLoad";
const MyCom = lazyLoad(React.lazy(() => import('@@/core/antd/PreviewMode')))
const Routes: RouteObject[] = [
  {
    path: "/",
    element: <DndProvider backend={HTML5Backend}>
    <AntdDesignForm></AntdDesignForm>
  </DndProvider>,
  },
  {
    path: "/preview-model",
    element: <MyCom />,
  },
];

export default Routes;
