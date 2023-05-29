import { Button, Row, Space } from "antd";
import { memo } from "react";
import PreviewMode from "./PreviewMode";

function OperatButton() {
  return (
    <Row justify="end">
      <Space wrap>
        <PreviewMode />
        <Button type="primary">查看源代码</Button>
      </Space>
    </Row>
  );
}

export default memo(OperatButton);
