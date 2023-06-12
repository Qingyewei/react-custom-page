import React, { memo, useState } from "react";
import { connect } from "@/utils/store";
import { WidgetForm } from "../../config/element";
import { Button, Drawer, Space } from "antd";
import AceEditorPage from "./AceEditorPage";

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`;

const ViewSourceCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const getViewPage = () => {
    return (
      <Drawer
        title="Basic Drawer"
        placement="bottom"
        height="100%"
        closable={false}
        onClose={handleCancel}
        open={isOpen}
        key="bottom"
        extra={
          <Space>
            <Button type="primary" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
      >
        <AceEditorPage
          name="ViewSourceCode"
          mode="tsx"
          defaultValue={`<div>ssss</div>`}
        />
      </Drawer>
    );
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        查看源代码
      </Button>
      {getViewPage()}
    </>
  );
};

export default connect((state: WidgetForm) => ({
  page: state.page,
  list: state.list,
}))(memo(ViewSourceCode));
