import { Button, Row, Space } from "antd";
import { memo } from "react";
import PreviewMode from "./PreviewMode";
import ViewSourceCode from "./ViewSourceCode";

function OperatButton() {
  return (
    <Row justify="end">
      <Space wrap>
        <PreviewMode />
        <ViewSourceCode />
      </Space>
    </Row>
  );
}

export default memo(OperatButton);
