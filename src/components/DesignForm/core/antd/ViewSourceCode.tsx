import React, { memo, useState } from "react";
import { connect } from "@/utils/store";
import { WidgetForm } from "../../config/element";
import { Button, Drawer, Space, message } from "antd";
import AceEditorPage from "./AceEditorPage";
import buildCode from "@/buildCode";

const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`;

const ViewSourceCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const code = buildCode()
  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      message.success("复制成功");
    })
    .catch((error) => {
      message.error("复制失败,error: " + error);
    });
  }

  const getViewPage = () => {
    return (
      <Drawer
        title="查看源代码"
        placement="bottom"
        height="100%"
        closable={false}
        onClose={handleCancel}
        open={isOpen}
        key="bottom"
        extra={
          <Space>
            <Button type="primary" onClick={handleCopy}>
              复制代码
            </Button>
            <Button type="primary" onClick={handleCancel}>
              关闭
            </Button>
          </Space>
        }
      >
        <AceEditorPage
          name="ViewSourceCode"
          mode="tsx"
          height="100%"
          theme="monokai"
          defaultValue={`${code}`}
        />
        {/* <AceEditorPage
          name="ViewSourceCode"
          mode="jsx"
          height="100%"
          theme="monokai"
          defaultValue={`<AceEditor
          placeholder="Placeholder Text"
          mode="javascript"
          theme="monokai"
          name="blah2"
          onLoad={this.onLoad}
          onChange={this.onChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={\`function onLoad(editor) {
          console.log("i've loaded");
          }\`}
          setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }} />`}
        /> */}
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
