import { Button, Row, Space } from "antd";
import { memo } from "react";
import PreviewMode from "./PreviewMode";
import ViewSourceCode from "./ViewSourceCode";

function OperatButton() {
  return (
    <Row justify="end">
      <Space wrap>
        {/* 需要优化首屏加载事件 */}
        <PreviewMode />
        <ViewSourceCode />
      </Space>
    </Row>
  );
}

export default memo(OperatButton);
