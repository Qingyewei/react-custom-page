import { useRoutes } from "react-router-dom";
import AntdDesignForm from "./components/DesignForm/core/antd/AntdDesignForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PreviewMode from "./components/DesignForm/core/antd/PreviewMode";
const Routes = [
  {
    path: "/",
    element: (
      <DndProvider backend={HTML5Backend}>
        <AntdDesignForm></AntdDesignForm>
      </DndProvider>
    ),
  },
  {
    path: "/preview-model",
    element: <PreviewMode></PreviewMode>,
  },
];

export default Routes;
