import React from "react";
import AntdDesignForm from "./components/DesignForm/core/antd/AntdDesignForm";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AntdDesignForm></AntdDesignForm>
    </DndProvider>
  );
}
